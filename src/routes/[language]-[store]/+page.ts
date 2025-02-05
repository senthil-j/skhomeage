import { error } from "@sveltejs/kit";
import { APP_CONSTANTS, getAppConfig, getBaseWebServiceUrl } from '../../lib/config/app-config.js';
import { HOMEPAGE_CONTENT_SLOT_ORDER, slotGroups } from '../../lib/services/common-mapper.js';
import { languageStoreDetails } from "../../stores/languageStore";

const { contentSlotInfo } = getAppConfig();

export async function load({ params, fetch }) {
    console.log(contentSlotInfo, 'getAppConfiggetAppConfig')
    let availableLanguages:any = "";
    let availableStore:any = "";
    const unsubscribe = languageStoreDetails.subscribe((availableSettings) => {
        availableLanguages = availableSettings?.availableLanguages;
        availableStore = availableSettings?.availableLanguages;
    });
    const { language, store } = params;
    // Validate lang and store
    if (
        !availableLanguages.includes(language) ||
        !availableStore.includes(store)
    ) {
        error(404, "Not found");
    }

    const contentSlotToComponentUidsArray =
		contentSlotInfo &&
		contentSlotInfo
			.substring(1, contentSlotInfo.length - 2)
			.split('], ')
			.map((s) => s.replace(/=\[/g, '='))
			.map((s) => s.split('='))
			.map(([a, b]) => [a, b])
			.filter(([slotName]) => HOMEPAGE_CONTENT_SLOT_ORDER.includes(slotName))
			.map(([slotName, compsString]) => [slotName, compsString.split(', ')])
			.sort(sorterBasedOnAnotherArray(HOMEPAGE_CONTENT_SLOT_ORDER));

	const slotNameToGroupedUidsArray =
		contentSlotToComponentUidsArray &&
		contentSlotToComponentUidsArray.length > 0 &&
		groupSlots(contentSlotToComponentUidsArray, slotGroups);

	const componentUids:any =
		slotNameToGroupedUidsArray &&
		slotNameToGroupedUidsArray
			.map(function (item) {
				return item[1];
			})
			.flat();
	console.log(componentUids, slotNameToGroupedUidsArray);

	if (slotNameToGroupedUidsArray && componentUids?.length) {
		const componentUrl = getComponentApiUrl(componentUids);
		const apiUrl =  getUrlWithQueryParams(componentUrl.url, componentUrl.params);

		const response = await fetch(apiUrl);
		const slotData = await response.json();
		const componentData = await transformComponentData(slotData);

		const componentDataMap =
			componentData &&
			componentData.component &&
			componentData.component
				.map((c) => {
					return { [c.uid]: c };
				})
				.reduce((prev, curr) => Object.assign(prev, curr), {});
		const componentDataMaptemp = componentUids.map(c => componentDataMap[c]);

		const childComponents =
        componentUids?.length > 0 &&
        componentUids.map((uid) => getComponentAsync(uid,componentDataMaptemp));
		
		const linkResponse = await fetch(childComponents[0]);
		const linkData = await linkResponse.json();
		return {pageComponentData: linkData, componentName:'CMSExternalLinksComponent'}
	}
}

 function getComponentAsync(uid,componentDataMaptemp) {
	const compData = componentDataMaptemp.find((c) => c?.uid === uid);
	const cmsLinks = compData?.cmsLinks;
	const urlParams = getComponentApiUrl(cmsLinks.split(' '));
    const apiUrl = getUrlWithQueryParams(urlParams.url, urlParams.params);
	return apiUrl;
}

function transformComponentData(componentData) {
	// if both tabComponent and history are present, delete history to avoid duplicate history render
	// because tabComponent also contains history
	const tabComponentIndex = componentData.component.findIndex(
		(c) => c.typeCode === 'ExtraTabComponent'
	);
	const historyComponentIndex = componentData.component.findIndex(
		(c) => c.placementId && c.placementId === 'home_page.history'
	);

	if (tabComponentIndex > -1 && historyComponentIndex > -1) {
		componentData.component[historyComponentIndex].HIDE_COMPONENT = true;
		// componentData.component.splice(historyComponentIndex, 1);
	}

	return componentData;
}


function sorterBasedOnAnotherArray(refArray:any) {
	return (a, b) => refArray.indexOf(a[0]) - refArray.indexOf(b[0]);
}

function groupSlots(sortedSlots:any, slotGroups:any) {
	const output:[] = [];
	const processedCombineIds:[] = [];
	sortedSlots.forEach((sortedSlot:any) => {
		const [slotname] = sortedSlot;
		if (slotname in slotGroups) {
			const combineId = slotGroups[slotname];
			if (processedCombineIds.indexOf(combineId) === -1) {
				// combine the slots
				const slotNamesWithCurrentCombineId = Object.keys(slotGroups).filter(
					(x) => slotGroups[x] === combineId
				);
				const combinedUids = sortedSlots
					.filter((x:any) => slotNamesWithCurrentCombineId.indexOf(x[0]) > -1)
					.map((x:any) => x[1])
					.flat();
				const combinedSlot = [slotname, combinedUids];
				output.push(combinedSlot);
				processedCombineIds.push(combineId);
			}
		} else {
			output.push(sortedSlot);
		}
	});
	return output;
}


function getComponentApiUrl(componentUids:any) {
	const webServiceEndpoint = getBaseWebServiceUrl();
	const { GET_CMS_COMPONENTS, appId } = APP_CONSTANTS;
	const url = `${webServiceEndpoint}/${GET_CMS_COMPONENTS}`;
	const { lang, jessionId } = getAppConfig();
	const componentIds = componentUids?.join(',');

	const params = {
		fields: 'FULL',
		lang,
		deviceId: jessionId,
		componentIds,
		pageSize: 50
	};
	return { url, params };
}

function getUrlWithQueryParams(url, queryParamsOverrides = {}) {
	const isAbsoluteUrl = url?.startsWith('http');
	console.log(url, queryParamsOverrides, 'url, queryParamsOverrides');
	let urlObject = new URL(url, 'https://dummy');
	const parametersFromUrl = Object.fromEntries(urlObject.searchParams.entries());
	console.log(url, parametersFromUrl, ' parametersFromUrlparametersFromUrl');
	const { jessionId, userSelectedCityCode, userDefaultCityCode } = getAppConfig();
	const defaultQueryParams = {
		appId: APP_CONSTANTS.APP_ID,
		AppSessionToken: jessionId,
		charset: 'utf-8',
		city: userSelectedCityCode || userDefaultCityCode
	};

	let mergedQP = {};
	if ('-*' in queryParamsOverrides) {
		delete queryParamsOverrides['-*'];
		mergedQP = Object.assign({}, parametersFromUrl, queryParamsOverrides);
	} else {
		mergedQP = Object.assign({}, defaultQueryParams, parametersFromUrl, queryParamsOverrides);
	}

	let queryString = '';
	const mergedQueryParamObject = new URLSearchParams(mergedQP);
	if (Object.keys(mergedQP).length > 0) {
		queryString = '?' + mergedQueryParamObject.toString();
	}

	let wholeUrl = '';
	if (isAbsoluteUrl) {
		wholeUrl = `${urlObject.origin}`;
	}
	wholeUrl += urlObject.pathname + queryString;

	return wholeUrl;
}
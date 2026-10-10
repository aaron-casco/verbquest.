export const UPDATE_ID='v13-guided-eggs';
export function shouldShowUpdate(p){return !!p?.pet&&p.testDone===true&&p.tour>=7&&!p.seenUpdates?.includes(UPDATE_ID);}
export function acknowledgeUpdate(p){if(!p||p.seenUpdates?.includes(UPDATE_ID))return false;p.seenUpdates=[...(Array.isArray(p.seenUpdates)?p.seenUpdates:[]),UPDATE_ID];return true;}

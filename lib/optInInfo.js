module.exports = function getOptInInfo(optInInfo = null, action) {
    if (action.type !== 'OPT_IN_INFO_SET') {
        return optInInfo;
    }

    // disconnect old script plumbing
    if (optInInfo) {
        throw new Error('opt in info already set');
    };

    return {
        fbAppId: action.fbAppId,
        fbMessengerId: action.fbMessengerId,
        payload: action.payload
    };
}

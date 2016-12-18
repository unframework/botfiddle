var React = require('react');

function FBOptInWidget({ fbAppId, fbMessengerId, payload }) {
    return <div style={{
        display: 'inline-block',
        width: FBOptInWidget.widthPx + 'px',
        height: FBOptInWidget.heightPx + 'px'
    }} ref={(dom) => {
        if (!dom) {
            return;
        }

        dom.innerHTML = '<div class="fb-send-to-messenger" messenger_app_id="' + fbAppId + '" page_id="' + fbMessengerId + '" data-ref="' + payload + '" color="blue" size="xlarge"></div>';
        window.FB.XFBML.parse(dom);
    }}></div>;
}

// well-known FB-defined size, exposed to help lay out containing elements
FBOptInWidget.widthPx = 172;
FBOptInWidget.heightPx = 66;

module.exports = FBOptInWidget;

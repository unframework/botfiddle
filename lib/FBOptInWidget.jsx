var React = require('react');

// @todo convert to pure function
class FBOptInWidget extends React.PureComponent {
    constructor({ fbAppId, fbMessengerId, payload }) {
        super();

        this._fbAppId = fbAppId;
        this._fbMessengerId = fbMessengerId;
        this._payload = payload;
    }

    render() {
        return <div style={{
            display: 'inline-block',
            width: FBOptInWidget.widthPx + 'px',
            height: FBOptInWidget.heightPx + 'px'
        }} ref={(dom) => {
            if (!dom) {
                return;
            }

            dom.innerHTML = '<div class="fb-send-to-messenger" messenger_app_id="' + this._fbAppId + '" page_id="' + this._fbMessengerId + '" data-ref="' + this._payload + '" color="blue" size="xlarge"></div>';
            window.FB.XFBML.parse(dom);
        }}></div>;
    }
}

// well-known FB-defined size, exposed to help lay out containing elements
FBOptInWidget.widthPx = 172;
FBOptInWidget.heightPx = 66;

module.exports = FBOptInWidget;

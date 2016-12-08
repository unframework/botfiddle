function FBOptInWidget(fbAppId, fbMessengerId, payload) {
    this._fbAppId = fbAppId;
    this._fbMessengerId = fbMessengerId;
    this._payload = payload;

    // well-known FB-defined size, exposed to help lay out containing elements
    this.widthPx = 172;
    this.heightPx = 66;
}

FBOptInWidget.prototype.type = 'Widget';

FBOptInWidget.prototype.init = function () {
    var dom = document.createElement('div');
    dom.style.display = 'inline-block';
    dom.style.width = this.widthPx + 'px';
    dom.style.height = this.heightPx + 'px';

    // @todo escaping
    dom.innerHTML = '<div class="fb-send-to-messenger" messenger_app_id="' + this._fbAppId + '" page_id="' + this._fbMessengerId + '" data-ref="' + this._payload + '" color="blue" size="xlarge"></div>';

    setTimeout(function () {
        window.FB.XFBML.parse(dom);
    }, 0);

    return dom;
};

FBOptInWidget.prototype.update = function (prev, dom) {
    // no-op
};

module.exports = FBOptInWidget;

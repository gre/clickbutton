var $ = window.jQuery;
var Q = require("q");

var ClickButton = function (options) {
    this.el = options.el;
    this.f = options.f;
    this.activeCls = options.activeCls || "active";
    this.debounceRate = ("debounceRate" in options) ? (options.debounceRate||0) : 200;
    var self = this;
    this._onclick = function (e) {
        self.onClick(e);
    };
};

ClickButton.create = function (options) {
    return new ClickButton(options);
};

// Same interface of https://github.com/peutetre/mobile-button/blob/master/lib/button.js until we use it
// Validation will come when the button.js implementation is ready
ClickButton.prototype = {
    bind: function () {
        $(this.el).on("click", this._onclick);
        this.binded = true;
    },
    unbind: function () {
        $(this.el).off("click", this._onclick);
        this.binded = false;
    },
    setEl: function (el) {
        this.el = el;
    },
    setF: function (f) {
        this.f = f;
    },
    setActive: function (active) {
        if (active)
            $(this.el).addClass(this.activeCls);
        else
            $(this.el).removeClass(this.activeCls);
        this.active = active;
    },
    onClick: function (e) {
        var self = this;
        if (!this.active && this.isValidClickEvent(e)) {
            Q.fcall(function () {
                self.setActive(true);
                return self.f(e);
            })
            .delay(this.debounceRate)
            .fin(function () {
                self.setActive(false);
            })
            .done();
        }
    },
    isValidClickEvent: function (e) {
        // left click only and no control key pressed
        return e.which === 1 && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey;
    }
};

module.exports = ClickButton;

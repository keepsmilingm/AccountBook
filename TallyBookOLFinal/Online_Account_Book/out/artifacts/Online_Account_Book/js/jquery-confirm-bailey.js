/*
 * 对 jquery-confirm 的扩展
 * 
 * @requires jquery-confirm
 * 
 * 向 jQuery 注入几个常用的几个弹出消息框方法
 */

if (typeof Jconfirm === 'undefined') {
    throw new Error('requires jquery-confirm');
}

if (typeof $.fail !== 'undefined' || typeof $.warn !== 'undefined' || typeof $.info !== 'undefined' || typeof $.question !== 'undefined') {
    throw new Error('自定义方法冲突!');
}

(function ($) {
    "use strict";

    var _alert = function (options) {
        if (!options.buttons) {
            options.buttons = {
                confirm: {
                    text: '确定',
                    btnClass: 'btn-blue',
                    action: function () {
                        this.close();
                        if ($.isFunction(options.confirmCallback)) options.confirmCallback();
                    }
                }
            };
        }

        $.alert(options);
    };

    /*
     * 弹出一般信息提示框
     */
    $.info = function (message, title, confirmCallback, confirmRequired) {
        $.confirm({
            title: title || '提示',
            type: 'blue',
            icon: 'glyphicon glyphicon-info-sign',
            autoClose: confirmRequired?false:'confirm|6000',
            content: message,
            buttons: {
                confirm: {
                    text: '确定',
                    btnClass: 'btn-blue',
                    action: function () {
                        this.close();
                        if ($.isFunction(confirmCallback)) confirmCallback();
                    }
                }
            }
        });
    };

    /*
     * 弹出错误提示消息框
     */
    $.fail = function (message, title, confirmCallback) {
        _alert({
            title: title || '错误',
            type: 'red',
            icon: 'glyphicon glyphicon-exclamation-sign',
            draggable: true,
            closeIcon: true,
            content: message,
            confirmCallback : confirmCallback
        });
    };

    /*
     * 弹出警告信息提示框
     */
    $.warn = function (message, title, confirmCallback) {
        _alert({
            title: title || '警告',
            type: 'orange',
            icon: 'glyphicon glyphicon-warning-sign',
            draggable: true,
            closeIcon: true,
            content: message,
            confirmCallback : confirmCallback
        });
    };

    $.question = function (message, confirmCallback, cancelCallback) {
        $.confirm({
            title: '提示',
            type: 'orange',
            icon: 'glyphicon glyphicon-question-sign',
            closeIcon: true,
            content: message,
            buttons: {
                confirm: {
                    text: '是',
                    btnClass: 'btn-blue',
                    action: function () {
                        if ($.isFunction(confirmCallback)) confirmCallback();
                    }
                },
                cancel: {
                    text: '否',
                    action: function () {
                        this.close();
                        if ($.isFunction(cancelCallback)) cancelCallback();
                    }
                }
            }
        });
    };

    /*
     * 弹出错误提示消息框
     */
    $.debugInfo = function (message) {
        _alert({
            title: 'Debugger',
            type: 'red',
            icon: 'fa fa-warning',
            draggable: true,
            closeIcon: true,
            content: '<div style="max-height: 500px;">' + message + '</div>',
            backgroundDismiss: true,
            columnClass: 'col-md-12'
        });
    };

})(jQuery);
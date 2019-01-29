// components/code.js
const __BACKBONE__ = require('../../services/backbone.service.js');
const __CODE_MAX_LENGTH__ = 6;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //  手机号码
        phone: {
            type: String,
            value: ''
        },
        //  手机号码是否使能
        isPhoneDisabled: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 组件内部数据
        sendBtnText: '发送', // 发送使能键
        timerId: 0, //  Timer ID
        countDownSeconds: 60, //  倒计时秒数  
        hasSent: false, //  验证码是否已发送 
        requestId: '',
        bizId: '',
        code: ''
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function() {},
        moved: function() {},
        detached: function() {},
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function() {
        console.log('ready ==> ', this.data.isPhoneDisabled);
    },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function() {},
        hide: function() {},
        resize: function() {},
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //  校验手机号码有效性
        _checkPhoneValidity: function(phone) {
            const reg = /^1[0-9]{10}$/;
            return reg.test(phone);
        },

        //  清空Timer
        _clearTimer: function() {
            clearInterval(this.data.timerId);
        },

        //  手机号码输入事件
        _onInputPhone: function(e) {
            this.data.phone = e.detail.value;
        },

        //  验证码输入事件
        _onInputCode: function(e) {
            this.data.code = e.detail.value;
            if (__CODE_MAX_LENGTH__ === this.data.code.length) {
                //	发送单选事件给使用者
                this.triggerEvent('onCompleteCodeEvt', {
                    requestId: this.data.requestId,
                    bizId: this.data.bizId,
                    phone: this.data.phone,
                    code: this.data.code
                }, {})
            }
        },

        //  倒计时
        _countDown: function() {
            this._clearTimer();
            this.data.timerId = setInterval(() => {
                this.data.countDownSeconds--;
                if (this.data.countDownSeconds <= 0) {
                    this._clearTimer();
                    this.setData({
                        countDownSeconds: 60,
                        hasSent: false,
                        sendBtnText: '重新发送'
                    })
                } else {
                    this.setData({
                        sendBtnText: `${this.data.countDownSeconds} 秒`
                    });
                }
            }, 1000);
        },

        //  发送验证码
        _onTapSendBtn: function(e) {
            const that = this;
            //  校验手机号码的有效性
            if (this._checkPhoneValidity(this.data.phone)) {
                this.setData({
                    hasSent: true
                });
                //  调用发送短信验证码的接口
                __BACKBONE__.sendVerificationCode({
                        phone: this.data.phone
                    })
                    .then(res => {
                        console.log(res)
                        if (res.data.code === 0) {
                            that._countDown();
                            that.data.requestId = res.data.requestId;
                            that.data.bizId = res.data.bizId;
                        } else {
                            wx.showToast({
                                title: '发送验证码失败',
                                icon: 'none',
                                duration: 3000
                            });
                        }

                    })
            } else {
                wx.showToast({
                    title: '请输入正确的手机号码',
                    icon: 'none',
                    duration: 3000
                });
            }

        }
    }
})
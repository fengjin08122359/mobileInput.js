/**
兼容
element

设置css
setAttribute('style','color:red;line-height:30px');

设置获取width,height
offsetHeight 
offsetWidth

监听scroll事件
window.addEventListener('scroll',winScroll);
function winScroll(e){
  // 拿到e之后进行你需要的处理
}
设置scrollTop
scrollTop
var winScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

滑动成功,滚动事件
**/
(function (window, $, undefined) {
  var path = [];

  var OS = (function (navigator, userAgent, platform, appVersion) {
    var detect = {}
    detect.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false
    detect.ipod = /iPod/i.test(platform) || userAgent.match(/(iPod).*OS\s([\d_]+)/) ? true : false
    detect.ipad = /iPad/i.test(navigator.userAgent) || userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false
    detect.iphone = /iPhone/i.test(platform) || !detect.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false
    detect.mac = /Mac/i.test(platform)
    detect.ios = detect.ipod || detect.ipad || detect.iphone
    detect.safari = userAgent.match(/Safari/) && !detect.chrome ? true : false
    detect.mobileSafari = detect.ios && !!appVersion.match(/(?:Version\/)([\w\._]+)/)
    if (detect.ios) detect.iosVersion = parseFloat(appVersion.slice(appVersion.indexOf("Version/") + 8)) || -1
    return detect
  })(navigator, navigator.userAgent, navigator.platform, navigator.appVersion || navigator.userAgent);
  $("html").css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  });
  var width = $("html").width();
  var height = $("html").height();

  var scrollTop = function (top) {
    if (typeof top === "undefined") {
      return $(window).scrollTop()
    } else {
      $(window).scrollTop(top)
      return $(window).scrollTop()
    }
  }

  var adHeight = (function () {
    var adjustHeight = 0;
    var special = 0;
    if (OS.ios && OS.iosVersion <= 12) {
      adjustHeight = 40;
      if (screen.height == 812 && screen.width == 375) {
        console.log("苹果X");
      } else if (screen.height == 736 && screen.width == 414) {
        if (width > 365 && width < 385) {
          adjustHeight = 40;
          special = 288
        }
        if (width > 404 && width < 424) {
          adjustHeight = 40;
          special = 303
        }
      } else if (screen.height == 667 && screen.width == 375) {
        if (width > 365 && width < 385) {
          adjustHeight = 40;
          special = 288
        }
        if (width > 404 && width < 424) {
          adjustHeight = 40;
          special = 303
        }
      } else if (screen.height == 568 && screen.width == 320) {
        console.log("iPhone5");
      } else {
        console.log("iPhone4");
      }
    }
    console.log(adjustHeight,special);
    return {
      adjustHeight: adjustHeight,
      special: special
    }
  })()

  var historyPath = {
    can: function () {
      if (path.length == 1 && path[0] == 2) {
        return true;
      } else if (path.length == 3 && path[0] == 1 && this.height) {
        return true;
      }
      return false
    },
    goTo: function () {
      console.log(path);
      if (path[0] == 2) {
        this.path0();
      } else if (path[0] == 1) {
        this.path1();
      }
    },
    save: function (h,t) {
      this.height = h;
      this.top = t;
    },
    path0: function () {
      var m = this;
      if (scrollTop() < 100) {
        scrollTop(99999)
      }
      setTimeout(function () {
        if (scrollTop() < 100) {
          scrollTop(99999)
        }
        if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
        inputCheck.success();
      }, 500);
    },
    path1: function () {
      var m = this;
      console.log("historyPath path1" + m.height);
      setTimeout(function () {
        if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
        scrollTop(adHeight.special ? (adHeight.special) : 99999);
        $("html").css({
          top: 0,
          width: "100%",
          height: (m.height)
        });
        inputCheck.success();
      }, 300)
    }
  }

  var inputCheck = {
    checkStatus: 1,
    init: function () {
      var m = this;
      $(window).on("scroll", function () {
        console.log("scroll"+m.checkStatus);
        if (m.checkStatus != 2) {
          m.startCheck();
        }
      })
      $(window).on("resize", function () {
        $("html,body").height('100%');
        console.log("resize"+m.checkStatus);
        if (m.checkStatus != 2) {
          m.startCheck();
        }
      })
    },
    startCheck: function () {
      var m = this;
      if (m.checkStatus != 0) {
        m.checkStatus = 0;
        if (!historyPath.can()) {
          if (OS.ios) {
            path[0] = 1
            m.checkIphone();
          } else {
            path[0] = 2
            m.checkNotIphone();
          }
        } else {
          historyPath.goTo();
        }
      }
    },
    success: function () {
      this.checkStatus = 1;
      $("body").height($("html").height() - adHeight.adjustHeight);
    },
    end: function () {
      var m = this;
      m.checkStatus = 2;
      setTimeout(function () {
        console.log('end' + m.checkStatus)
        if (m.checkStatus != 0) {
          if (m.checkTimeout) {
            clearTimeout(m.checkTimeout);
          }
          $("html").css({
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%"
          });
          console.log('end');
          $("html,body").height('100%');
        }
      }, 100);
    },
    checkIphone: function () {
      var m = this;
      if (m.checkTimeout) {
        clearTimeout(m.checkTimeout);
      }
      m.checkTimeout = setTimeout(function () {
        m.checkIphoneFun();
      }, 300)
    },
    checkNotIphone: function () {
      var m = this;
      if (m.checkTimeout) {
        clearTimeout(m.checkTimeout);
      }
      if (scrollTop() < 100) {
        scrollTop(99999)
      }
      m.checkTimeout = setTimeout(function () {
        if (scrollTop() < 100) {
          scrollTop(99999)
        }
        m.checkNotIphoneFun();
      }, 500);
    },
    samples: [],
    checkIphoneFun: function () {
      var m = this;
      if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
      if (m.checkTimeout) {
        clearTimeout(m.checkTimeout);
      }
      m.samples = [];
      m.getSample();
    },
    checkNotIphoneFun: function () {
      var m = this;
      if (scrollTop() < document.body.scrollHeight && document.documentElement.scrollTop != 0) {
        path[0] = 1
        this.checkIphone()
      } else if (!($("body").width() == 320)) { //iphone5例外
        if (scrollTop() < 100) {
          scrollTop(99999)
        }
        if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
        m.success();
      }
    },
    getSample: function () {
      var m = this;
      if (adHeight.special && m.samples.length == 0) {
        scrollTop(adHeight.special);
      }
      var scHeight = document.body.scrollHeight;
      var htmlHeight = $("html").height();
      var scrollY = scrollTop();
      m.samples.push({
        scHeight: scHeight,
        scrollY: scrollY,
        height: htmlHeight
      });
      m.changeHeight();
      if (m.samples.length == 1) {
        m.checkTimeout = setTimeout(function () {
          if (scrollTop() < 100) {
            var keyboardHeight = scrollTop() || (height - window.innerHeight);
            var sheight = keyboardHeight || 99999;
            scrollTop(sheight)
          }
          m.getSample();
        }, 500);
      }
    },
    changeHeight: function () {
      var m = this;
      console.log(JSON.stringify(m.samples));
      if (m.samples.length == 1) {
        var w = m.checkHeight(m.samples[0])
        var a = w.a
        var b = w.b
        var c = w.c;
        var h = w.h;
        if (c < -100) {
          m.samples[0].type = 1;
        } else if (a < 10) {
          if (b > 0) {
            m.samples[0].type = 2;
            $("html").css({
              top: 0,
              width: "100%",
              height: h
            });
          } else {
            m.samples[0].type = 3;
            $("html").css({
              top: 0,
              width: "100%",
              height: (height)
            });
          }
        } else {
          m.samples[0].type = 4;
          $("html").css({
            top: 0,
            width: "100%",
            height: height
          });
          scrollTop(0);
        }
        path[1] = m.samples[0].type;
        return;
      } else if (m.samples.length >= 2) {
        var first = m.samples[0];
        var second = m.samples[1];
        path[2] = 3
        if (first.scrollY == second.scrollY && first.height == second.height && first.scHeight == second.scHeight) {
          path[2] = 0
          historyPath.save($("html").height(),$("html").css("top"));
          m.success();
          return;
        } else if (first.scrollY != second.scrollY) {
          var w = m.checkHeight(second);
          var b = w.b;
          var h = w.h;
          if (b > 0) {
            second.type = 2;
            $("html").css({
              top: 0,
              width: "100%",
              height: h
            });
          } else {
            $("html").css({
              top: 0,
              width: "100%",
              height: height
            })
          }
          path[2] = 1
          m.samples = [m.samples.pop()];
        } else if (first.height != second.height) {
          if (first.type == 3) {
            path[2] = 2
            $("html").css({
              top: 0,
              width: "100%",
              height: (second.height)
            });
          }
          historyPath.save(second.height,$("html").css("top"));
          m.success();
          return;
        } else {
          historyPath.save($("html").height(),$("html").css("top"));
          m.success();
          return;
        }
      }
    },
    checkHeight: function (sample) {
      var a = Math.abs(sample.scHeight - height);
      var b = sample.scrollY - height * 2;
      var c = sample.height - height;
      var d = sample.scHeight - sample.scrollY;
      var h = Math.min(d, height / 2);
      h = parseInt(Math.max(h, height / 2));
      return {
        a: a,
        b: b,
        c: c,
        h: h,
      }
    },
    focusAfterInsert: function () {
      var m = this;
      var continueInsert = (height != $("html").height() || scrollTop() != 0)
      if (continueInsert) {
        m.checkStatus = 0;
        setTimeout(function () {
          m.checkStatus = 1;
        }, 200)
      }
      return continueInsert
    }
  }
  var MOBILEINPUT = function (options) {
    this.defaults = {
        compantPk: "",
        codeKey: "",
        type: "",
      },
      this.options = $.extend({}, this.defaults, options);
  }
  MOBILEINPUT.prototype = inputCheck
  MOBILEINPUT.prototype.height = height
  MOBILEINPUT.prototype.scrollY = scrollTop
  $.mobileInput = function (options) {
    var mobileInput = new MOBILEINPUT(options);
    mobileInput.init();
    return mobileInput;
  }
})(window, jQuery);

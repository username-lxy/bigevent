$.ajaxPrefilter(function(option) {
    // console.log(option);
    // 将根路径与url进行拼接
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
    // 统一定义headers
    // 判断是否需要有headers,可以直接判断请求的url中是否含有my,
    // indexOf()方法可以直接判断，当不存在时会返回-1，当存在的时候会返回第一个索引
    if (option.url.indexOf('/my/') != -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 为统一的ajax请求，挂载一个complete回调函数
    option.complete = function(res) {
        // console.log(res);
        // 判断当信息获取失败时，将json格式的对象，转换为正常对象
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制跳转到登陆页面
            location.href = '/login.html';
            // 2、清空localStorage中的token
            window.parent.localStorage.removeItem('token');
        }
    }
})
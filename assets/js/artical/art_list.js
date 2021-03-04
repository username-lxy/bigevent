$(function() {

    var deleteLength = null;
    // 定义文章的data参数
    var listData = {
        pagenum: 1, // 页码值，默认为1
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的id
        state: '', // 文章的状态
    }
    initList();

    // 定义渲染文章数据的函数
    function initList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: listData,
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('文章列表获取失败');
                // 渲染数据
                deleteLength = res.data.length;
                page(res.total);
                var list = template('initArtList', res);
                $('tbody').html(list);
            }
        })
    }

    // 定义一个动态获取筛选列表的表单
    function artList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('文章分类获取失败');
                var cateName = template('cateName', res);
                // console.log(res);
                $('[name=select]').html(cateName);
                // layui.form.render('newForm');
                layui.form.render('select');
            }
        })
    }

    artList();
    // 监听表单的提交事件，筛选文章数据
    $('#selectArt').on('submit', function(e) {
        e.preventDefault();
        // console.log(1);
        listData.cate_id = $('[name=select]').val();
        listData.state = $('[name=state]').val();
        // console.log($('[name=state]').val());
        // 重新获取数据，渲染文章内容
        // console.log(listData);
        initList();
    })

    // 给编辑框绑定事件,动态添加的按钮，需要用事件代理
    $('tbody').on('click', '#editBtn', function() {
        // 强制跳转到编辑页面
    })

    // 给删除按钮绑定事件
    $('tbody').on('click', '#deleteArt', function() {
        const id = $(this).siblings('button').attr('data-id');
        layer.confirm('你真的要删除吗?', { icon: 3, title: '提示' }, function(index) {
            console.log(id);
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layui.layer.msg('文章删除失败');
                    layui.layer.msg('文章删除成功');
                    // console.log(deleteLength);
                    // alert(deleteLength)
                    // 当进行删除的时候，当我们删除完最后一条数据的时候，此时这个页面已经没有了数据
                    // 我们就不需要再去发送ajax请求当前页面的内容，那么我们可以来判断一下，当前页面是否还有数据
                    // 方法：当这个页面还剩下一个数据的时候，如果此时点击删除成功，也就是将最后一条数据删除，那么我们直接让页码-1直接去获取下一个页面的内容即可
                    if (deleteLength === 1) {
                        listData.pagenum = listData.pagenum > 1 ? listData.pagenum - 1 : listData.data;
                    }
                    initList();
                }
            })
            layer.close(index);
        });
    })


    // 定义页码的操作
    // 1、将所展示的数据，与当前的页面相对应
    // 2、当点击页码的时候，将页码对应的数据展示出来
    function page(total) {
        layui.use('laypage', function() {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'test1', // 分页的id
                count: total, // 总共的数据
                curr: listData.pagenum, // 设置默认选中的分页
                limit: listData.pagesize, // 每页显示多少条数据
                limits: [2, 3, 5, 10], // 下拉框的值
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 都有哪个选项
                jump: function(obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    listData.pagenum = obj.curr;
                    listData.pagesize = obj.limit;
                    // 发生死循环的原因
                    // 1、点击页码的时候触发jump回调
                    // 2、由render函数触发jump回调
                    // 当由render触发的时候，first显示为true
                    //首次不执行
                    // console.log(first);
                    if (!first) {
                        initList();
                        //do something
                    }
                }
            });
        });

    }


    // 定义一个事件过滤器
    template.defaults.imports.time = function(pubData) {
        var nowTime = new Date(pubData);
        var y = nowTime.getFullYear();
        var m = padZero(nowTime.getMonth() + 1);
        var d = padZero(nowTime.getDate());

        var hh = padZero(nowTime.getHours());
        var mm = padZero(nowTime.getMinutes());
        var ss = padZero(nowTime.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 对时间进行补零
    function padZero(a) {
        return a = a > 10 ? a : '0' + a;
    }
})
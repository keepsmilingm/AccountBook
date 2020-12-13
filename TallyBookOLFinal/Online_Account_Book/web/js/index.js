var bills = [];
//点击编辑账单条目
var item_id; //记录项的当前序号
var elemid;//记录项的id
var idsBuffer = []; //暂存账单id数组
var isFirstOnly = true; //判断是否第一次点击仅查看按钮
var isSearch = false; //判断是否点击过搜索
var isChartsView = true;

$(document).ready(function () {

    getBillsFromServer(function (result) {
        bills = result;
        var biss=bills;

        // 显示账单列表
        showBillItems();

        //给每个item绑定id
        $(".record").each(function(i) {
            $(this).attr('id',biss[i].id )
        });

        // 显示结余
        refreshBalance();
    });

    // 注册 "打开/关闭"账单编辑面板"按钮 的点击事件监听
    $('#btn-add-bill').click(toggleBillEditor);
    // 注册 "搜索按钮"的点击事件监听
    $('#btn-search-bill').click(searchBill);
    // 注册 "记一笔" 按钮点击事件监听
    $('#btn-confirm-add').click(addBillItem);
    $('#only-see-in').click(onlySeeIn);
    $('#only-see-out').click(onlySeeOut);
    $('#see-all').click(seeAll);
    $('#btn-switch').click(switchView);

});

//一条账单的HTML模板
var billItemTemplete = '<li class="record" >' +
    '<div class="date-time">' +
    '<h2 class="date" data-field="date"></h2>' +
    '<p class="time" data-field="time"></p>' +
    '</div>' +
    '<div class="content">' +
    '<h4 class="media-heading io" data-field="amount"></h4>' +
    '<p class="memo" data-field="memo"></p>' +
    '<p class="memo" data-field="type"></p>' +
    '</div>' +
    '</li>';

//创建一条账单的DOM
//参数bill是一条账单的数据
function createBillItemDom(bill) {

    //$item为一条账单的DOM
    var $item = $(billItemTemplete);

    //将账单时间构建成moment对象，以便后续格式化输出
    //moment()来自第三方库moment.js
    var dt = moment(bill.time);

    //遍历所有含有data-field属性的元素
    //并使用数据模型(bill)中的值替换此元素的内容(innerText)
    $item.find('[data-field]').each(function (i,ele){
        //针对每一个含有"data-field"属性的元素，此匿名函数将被执行一次
        //其中参数i为顺序号，ele为当前遍历到的元素

        //将ele这个普通的DOM元素封装成jQuery对象，以便处理
        var $ele = $(ele);

        //读取当前元素的 data-field属性值
        var field = $ele.attr('data-field');

        //根据 data-field属性值不同，分别做不同处理
        switch (field) {

            case 'date' :
                $ele.text(dt.format('MM/DD'));
                break;
            case 'time' :
                $ele.text(dt.format('HH:mm:ss'));
                break;

            case 'amount' :
                $ele.text(formatMoney(bill.amount, true,1));
                //若金额大于0，则给当前元素(金额字段)添加样式类in(显示为绿色)
                if (bill.amount > 0) {
                    $ele.addClass('in');
                }
                break;
            default:    //对于其余元素(如:memo)，直接使用bill中的相应属性值填充
                $ele.text(bill[field]);
        }
    });

    var time=null;
    // 注册账单项的双击事件监听
    $item.dblclick(function (){
    console.log("双击");
    removeBillItem($item, bill);
    clearTimeout(time);
    }).click(function () {
        clearTimeout(time);
        time=setTimeout(function () {
            edit($item);
            console.log("单击");
        },200)
    });

    return $item;
}

//显示账本中所有账单
function showBillItems() {
    //账单列表的容器
    var $billItem = $('#bill-items');

    //清空账单列表
    $billItem.empty();

    //遍历整个bills数组，构建每一个账单的dom模型,并将其"装入"账单列表容器
    for (var i = 0; i < bills.length; i ++) {
        $billItem.append(createBillItemDom(bills[i]));
    }
}

//显示结余
function refreshBalance () {
    var balance = 0;
    var moneyin=0;
    var moneyout=0;
    for (var i = 0; i < bills.length; i ++) {
        balance += bills[i].amount;
        if(bills[i].amount>0){
            moneyin+=bills[i].amount;
        }else{
            moneyout+=bills[i].amount;
        }
    }


    //刷新界面
    var $balance = $('#balance');
    var $moneyin = $('#moneyin');
    var $moneyout = $('#moneyout');
    $balance.css('color',(balance > 0) ? '#34ce9f' : '#ce4844');
    $moneyin.css('color', '#34ce9f');
    $moneyout.css('color', '#ce4844');
    $balance.find('span').text(formatMoney(balance, false,1));
    $moneyin.find('span').text(formatMoney(moneyin, false,2));
    $moneyout.find('span').text(formatMoney(moneyout, false,2));
}

//格式化金额显示
//money -- 金额，单位：分
//signed -- 是否强制显示正负号
function formatMoney (money,signed,flag) {

    var m = money / 100.0;

    switch (flag) {
        case 1:
            return (m > 0 ? (signed ? '+' : '') : (m == 0) ? '' : '-') + toDecimal2(Math.abs(m));
            break;
        case 2:
            return (m > 0 ? (signed ? '+' : '') : ((m == 0) ? '' : (signed ? '-' : ''))) + toDecimal2(Math.abs(m));
            break;
    }
}

//打开/关闭账单编辑面板
function toggleBillEditor() {
    //显示/隐藏“账单编辑面板”
    $("#panel-bill-editor").toggle('fast');

    //切换展开和关闭图标
    var $btnIcon = $(this).find('i');
    $btnIcon.toggleClass('glyphicon-minus-sign');
    $btnIcon.toggleClass('glyphicon-plus-sign');
}

// 新增一条账单的数据到账本数据模型
// 参数说明:
// callback - 数据模型更新成功后的回调函数
function addBillItemData(bill, callback) {

    saveToServer('append',bill,function (newBill) {

        bills.unshift(bill);
        // 回调刷新界面
        callback(bill);
    });
}

function searchBill () {

    if (isChartsView) {
        showDetails();
    }

    isSearch = true;
    idsBuffer=[];

    var $fSearch = $('#search-editor');

    var searchContext = $fSearch.val();
    var flag = 1;

    var sort_type=$('#sort_type').val();

    if (searchContext == null || searchContext === '') {
        flag = 0;
        isSearch = false;
        isFirstOnly = true;
    }

    $.ajax( {
        url:'http://localhost:8080/TallyBookOL/wl/searchBills',
        type:'post',
        dataType: 'json',
        data: {
          searchContext:searchContext,
          flag:flag,
          sort_type:sort_type
        },
        success:function (resp) {
            getBillsFromServer(function () {
                bills = resp.result;
                var biss = bills;

                // 显示账单列表
                showBillItems();

                //给每个item绑定id
                $(".record").each(function (i) {
                    $(this).attr('id', biss[i].id)
                });
                // 显示结余
                refreshBalance();



                $(".record").each(function (i){
                    idsBuffer.push( $(this).attr('id'));
                } );

            });
        },
        error: function () {
            $.fail('失败');
        },
        complete: function () {

        }
    });

}

function onlySeeIn () {

    var s=[];
    $(".record").each(function (i){
        s.push( $(this).attr('id'));
    } );


    var sort_type=$('#sort_type').val();
    if (isSearch) {
        if (isFirstOnly) {
            $.ajax({
                url:'http://localhost:8080/TallyBookOL/onlySeeIn',
                type:'post',
                dataType:'json',
                data:{
                    sort_type:sort_type,
                    oldBills:JSON.stringify(s)
                },
                success: function (resp) {
                    getBillsFromServer(function () {
                        bills = resp;

                        /* if (bills === null) {
                             $.fail('目前没有收入数据');
                             return;
                         }*/

                        var biss = bills;

                        // 显示账单列表
                        showBillItems();

                        //给每个item绑定id
                        $(".record").each(function (i) {
                            $(this).attr('id', biss[i].id)
                        });
                        // 显示结余
                        refreshBalance();

                    });
                },
                error:function () {
                    $.fail('出错了！');
                },
                complete:function () {

                }
            });
            isFirstOnly = false;
        } else {
            $.ajax({
                url:'http://localhost:8080/TallyBookOL/onlySeeIn',
                type:'post',
                dataType:'json',
                data:{
                    sort_type:sort_type,
                    oldBills:JSON.stringify(idsBuffer)
                },
                success: function (resp) {
                    getBillsFromServer(function () {
                        bills = resp;

                        /* if (bills === null) {
                             $.fail('目前没有收入数据');
                             return;
                         }*/

                        var biss = bills;

                        // 显示账单列表
                        showBillItems();

                        //给每个item绑定id
                        $(".record").each(function (i) {
                            $(this).attr('id', biss[i].id)
                        });
                        // 显示结余
                        refreshBalance();

                    });
                },
                error:function () {
                    $.fail('出错了！');
                },
                complete:function () {

                }
            });
        }
    }

    if (!isSearch) {
        $.ajax({
            url:'http://localhost:8080/TallyBookOL/wl/onlySeeIn1',
            type:'post',
            dataType:'json',
            data :{
                sort_type:sort_type
            },
            success: function (resp) {
                getBillsFromServer(function () {
                    bills = resp.result;

                    var biss = bills;

                    // 显示账单列表
                    showBillItems();

                    //给每个item绑定id
                    $(".record").each(function (i) {
                        $(this).attr('id', biss[i].id)
                    });
                    // 显示结余
                    refreshBalance();

                });
            },
            error:function () {
                $.fail('出错了！');
            },
            complete:function () {

            }
        });
    }

}

function onlySeeOut () {

    var s=[];
    $(".record").each(function (i){
        s.push( $(this).attr('id'));
    } );


    var sort_type=$('#sort_type').val();
    if (isSearch) {
        if (isFirstOnly) {
            $.ajax({
                url:'http://localhost:8080/TallyBookOL/onlySeeOut',
                type:'post',
                dataType:'json',
                data :{
                    sort_type:sort_type,
                    oldBills:JSON.stringify(s)
                },
                success: function (resp) {
                    getBillsFromServer(function () {
                        bills = resp;

                        /*if (bills === null) {
                            $.fail('目前没有支出数据');
                            return;
                        }*/

                        var biss = bills;

                        // 显示账单列表
                        showBillItems();

                        //给每个item绑定id
                        $(".record").each(function (i) {
                            $(this).attr('id', biss[i].id)
                        });
                        // 显示结余
                        refreshBalance();

                    });
                },
                error:function () {
                    $.fail('出错了！');
                },
                complete:function () {

                }
            });
            isFirstOnly = false;
        }else {
            $.ajax({
                url:'http://localhost:8080/TallyBookOL/onlySeeOut',
                type:'post',
                dataType:'json',
                data :{
                    sort_type:sort_type,
                    oldBills:JSON.stringify(idsBuffer)
                },
                success: function (resp) {
                    getBillsFromServer(function () {
                        bills = resp;

                        /*if (bills === null) {
                            $.fail('目前没有支出数据');
                            return;
                        }*/

                        var biss = bills;

                        // 显示账单列表
                        showBillItems();

                        //给每个item绑定id
                        $(".record").each(function (i) {
                            $(this).attr('id', biss[i].id)
                        });
                        // 显示结余
                        refreshBalance();

                    });
                },
                error:function () {
                    $.fail('出错了！');
                },
                complete:function () {

                }
            });
        }
    }

    if (!isSearch) {
        $.ajax({
            url:'http://localhost:8080/TallyBookOL/wl/onlySeeOut1',
            type:'post',
            dataType:'json',
            data :{
                sort_type:sort_type
            },
            success: function (resp) {
                getBillsFromServer(function () {
                    bills = resp.result;

                    var biss = bills;

                    // 显示账单列表
                    showBillItems();

                    //给每个item绑定id
                    $(".record").each(function (i) {
                        $(this).attr('id', biss[i].id)
                    });
                    // 显示结余
                    refreshBalance();

                });
            },
            error:function () {
                $.fail('出错了！');
            },
            complete:function () {

            }
        });
    }

}

function seeAll () {

    isSearch = false;
    isFirstOnly = true;

    var $onlySee = $('.radio_btn');
    var $sort = $('#sort0');
    var $fsearch = $('#search-editor');

    $('#onlySeeBtn').css('display','inline-block');

    $fsearch.val('');
    $onlySee.attr("checked",false);
    $sort.attr("selected",true);
    $sort.attr("selected",false);

    $.ajax({
        url:'http://localhost:8080/TallyBookOL/wl/getBills',
        type:'post',
        dataType:'json',
        success: function (resp) {
            console.log(resp);
            getBillsFromServer(function () {
                bills = resp.result;
                var biss = bills;

                // 显示账单列表
                showBillItems();

                //给每个item绑定id
                $(".record").each(function (i) {
                    $(this).attr('id', biss[i].id)
                });
                // 显示结余
                refreshBalance();

            });
        },
        error:function () {
            $.fail('出错了！');
        },
        complete:function () {

        }
    });
}

function addBillItem() {
    // 找到金额和备注输入框
    var $fAmount = $('#nb-amount');
    var $fMemo = $('#nb-memo');
    var $fType = $('#nb-type');
    console.log($fType.val());

    // 取得用户输入的金额值, 并做验证
    var amount = parseFloat($fAmount.val());
    if (!amount) {
        // $.fail() 将弹出一个漂亮的消息框, 作用和 alert('金额不对哦~') 相同, 只是更漂亮
        // $.fail() 借助了 jquery-confirm.3.3.min.js 提供的功能
        // 并在 jquery-confirm-bailey.js 做了扩展, 可参看附件中的代码
        $.fail('金额不对哦~');
        return;
    }

    // 新增账单的数据
    var bill = {
        id: Math.random(),                  // 取一个随机数作为账单ID (不太科学, 姑且先用, 第(三)节中此ID将由数据库自动生成)
        time: new Date(),                   // 取客户端当前系统时间
        amount: Math.round(amount * 100),   // 用户输入的金额乘以100后取整. 由"元"换算成"分"
        memo: $fMemo.val(),
        type: $fType.val()
    };

    // 数据模型更新成功后的回调函数, 实现界面刷新
    var callback = function (bill) {
        console.log(bill);
        // 创建新账单项的DOM
        var $billItemDom = createBillItemDom(bill);
        // 插入到账单列表(#bill-items) 的第 1 项之前
        $('#bill-items').prepend($billItemDom);

        // 清空账单编辑面板中的"金额"和"备注"输入框
        $fAmount.val('');
        $fMemo.val('');
        $fType.val('');

        // 刷新结余显示
        refreshBalance();
    };
    window.location.reload();
    // 添加账单数据模型, 成功后回调, 刷新界面
    addBillItemData(bill, callback);
}

// 从账本中删除账单数据 (更新账本数据模型), 成功后回调刷新界面
// 参数说明:
// bill - 待删除的账单数据
// callback - 删除成功(账本数据模型更新成功)后的回调函数
function removeBillData(bill, callback) {
    // 保存数据到服务器端, 调用的仍然是 Code-11.2.1 中的 saveToServer 函数, 只是参数变了
    saveToServer('remove', bill, function () {
        // 删除前端账本数据模型中对应的记录, 与服务器端保存一致
        for (var i = 0; i < bills.length; i++) {
            if (bills[i].id === bill.id) {
                bills.splice(i, 1);
                break;
            }
        }
        // 回调刷新界面
        callback();
    });
}

// $item 为用户双击的账单项的DOM
// bill 双击的那个账单项对应的数据对象
function removeBillItem($billItemDom, bill) {

    // $.question() 将弹出一个漂亮的提示框
    // $.question() 借助了 jquery-confirm.3.3.min.js 提供的功能
    // 并在 jquery-confirm-bailey.js 做了扩展, 可参看附件中的代码
    $.question('确定要删除此账单?', function () {
        // 删除数据模型中的账单, 成功后回调刷新界面
        removeBillData(bill, function () {
            // 从 DOM 中移除当前账单项, 即从界面上移除当前账单
            $billItemDom.remove();
            // 刷新"结余"显示
            refreshBalance();
        });
    });
}

function getBillsFromServer(callback) {

    jQuery.ajax({
        url:"http://localhost:8080/TallyBookOL/wl/getBills",
        type: 'post',
        dataType: "json",
        beforeSend: function () {
            $("#progress").show();
        },
        success: function (resp) {
            // console.log(resp.result);
            callback(resp.result);
        },
        error: function (resp) {
            $.fail("说出来你可能不信，数据库不给我东西!!");
            // console.log(resp);
        },
        complete: function () {
            $("#progress").hide();
        }
    });
}

function saveToServer (action,bill,callback) {
    if(bill.amount > 0){
        bill.type = null;
    }
    $.ajax ({
        url: "http://localhost:8080/TallyBookOL/wl/addOrDeleteBill",
        type:'post',
        dataType: "json",
        data: {
            action:action,
            bill:JSON.stringify(bill)
        },
        beforeSend : function () {
            $("#progress").show();
        },
        success:function (resp) {
            if (resp.code >= 0) {
                callback(resp.result);
                // window.location.reload();
            }
        },
        error:function () {
            $.fail("哎呀，服务器说不要你的数据，你自己看着办吧！！！");
        },
        complete:function (){
            $("#progress").hide();
        }
    });
}

//点击条目弹出编辑框
function edit(element) {
    //取得点击元素的id
    elemid=element.attr('id');
    item_id = element.index();
    var result;

    jQuery.ajax({
        url:"http://localhost:8080/TallyBookOL/wl/getBill",
        type: 'post',
        data: {id: elemid},
        dataType: "json",
        beforeSend: function () {
            $("#progress").show();
        },
        success: function (resp) {

            result=resp.result;

            if (result.amount > 0) {
                $('#panel-bill-editor2').css('display', 'none');
                $('#panel-bill-editor3').css('display', 'block');

                $('#amount1').attr("value", (toDecimal2(result.amount/100)));
                $('#memo1').attr("value", result.memo);
            } else {
                $('#panel-bill-editor3').css('display', 'none');
                $('#panel-bill-editor2').css('display', 'block');

                $('#amount').attr("value", (toDecimal2(result.amount/100)));
                $('#memo').attr("value", result.memo);
                switch (resp.result.type) {
                    case "饮食":
                        $('#updateType1').attr("selected",true);
                        break;
                    case "交通":
                        $('#updateType2').attr("selected",true);
                        break;
                    case "娱乐":
                        $('#updateType3').attr("selected",true);
                        break;
                    case "学习":
                        $('#updateType4').attr("selected",true);
                        break;
                    case "日用":
                        $('#updateType5').attr("selected",true);
                        break;
                    case "其他":
                        $('#updateType6').attr("selected",true);
                        break;
                }
            }


        },
        error: function () {
            // 请求失败的回调函数
            $.fail("哦豁，修改失败，刺不刺激？");
        },
        complete: function () {       // 请求完成时的回调函数
            $("#progress").hide();    // 隐藏进度提示
        }
    });
}
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}
//提交支出账单的修改
function updateOut() {
    jQuery.ajax({
        url: "http://localhost:8080/TallyBookOL/wl/modifyBill",          // 对应 Code-10.1 第 17 行, 注意多了 "/wl" 前缀
        type: 'post', // 声明以 Post 方式发送请求
        data: {
            id: elemid,
            amount: $('#amount').val() * 100,
            memo: $('#memo').val(),
            type:$('#type').val()
        },
        dataType: "json",             // 告诉 jQuery, 服务器端返回的数据是 JSON 格式
        beforeSend: function () {     // 发送请求前的回调函数
            $("#progress").show();    // 发送请求前显示进度提示(左下角一个绕圈圈的动画)
        },
        success: function (resp) {
            // 请求成功时的回调函数
            // console.log(resp);
            getBillsFromServer(function () {
                bills = resp.result;
                var biss = bills;

                // 显示账单列表
                showBillItems();

                //给每个item绑定id
                $(".record").each(function (i) {
                    $(this).attr('id', biss[i].id)
                });
                // 显示结余
                refreshBalance();
                window.location.reload();
            });

        },
        error: function () {
            // 请求失败的回调函数
            $.fail("修改失败，别问我为什么！");
        },
        complete: function () {       // 请求完成时的回调函数
            $("#progress").hide();    // 隐藏进度提示
        }
    });
}

//提交收入账单的修改
function updateIn() {
    jQuery.ajax({
        url: "http://localhost:8080/TallyBookOL/wl/modifyBill",          // 对应 Code-10.1 第 17 行, 注意多了 "/wl" 前缀
        type: 'post', // 声明以 Post 方式发送请求
        data: {
            id: elemid,
            amount: $('#amount1').val() * 100,
            memo: $('#memo1').val(),
            type:''
        },
        dataType: "json",             // 告诉 jQuery, 服务器端返回的数据是 JSON 格式
        beforeSend: function () {     // 发送请求前的回调函数
            $("#progress").show();    // 发送请求前显示进度提示(左下角一个绕圈圈的动画)
        },
        success: function (resp) {
            // 请求成功时的回调函数
            // console.log(resp);
            getBillsFromServer(function () {
                bills = resp.result;
                var biss = bills;

                // 显示账单列表
                showBillItems();

                //给每个item绑定id
                $(".record").each(function (i) {
                    $(this).attr('id', biss[i].id)
                });
                // 显示结余
                refreshBalance();
                window.location.reload;
            });

        },
        error: function () {
            // 请求失败的回调函数
            $.fail("修改失败，别问我为什么！");
        },
        complete: function () {       // 请求完成时的回调函数
            $("#progress").hide();    // 隐藏进度提示
        }
    });
}

//排序选择
function sort() {
    var s=[];
    var sort_type=$('#sort_type').val();
    $(".record").each(function (i){
        s.push( $(this).attr('id'));
    } );

    jQuery.ajax({
        url: "http://localhost:8080/TallyBookOL/sort",          // 对应 Code-10.1 第 17 行, 注意多了 "/wl" 前缀
        type: 'post', // 声明以 Post 方式发送请求
        data: {
            sort_type:sort_type,
            oldBills:JSON.stringify(s)
        },
        dataType: "json",             // 告诉 jQuery, 服务器端返回的数据是 JSON 格式
        success: function (resp) {

            // console.log(resp);
            bills = resp;
            var biss=bills;

            // 显示账单列表
            showBillItems();

            //给每个item绑定id
            $(".record").each(function(i) {
                $(this).attr('id',biss[i].id )
            });

            // 显示结余
            refreshBalance();
        },
        error: function () {
            // 请求失败的回调函数
            $.fail("就你这丑样，还想排序？想啥呢~~~~~~");
        }
    })
}
//关闭修改面板
function cancel() {
    $('#panel-bill-editor2').css('display', 'none');
    $('#panel-bill-editor3').css('display', 'none');
}

//展示图表
function showCharts() {
    $('#bill-items').attr('style','display:none');
    $('#charts_item').attr('style','display:block');
    $('#actionArea').css('display', 'none');
    $('#divTop').css('display', 'none');
    isChartsView = true;
}

function showDetails() {
    $('#charts_item').attr('style','display:none');
    $('#bill-items').attr('style','display:block');
    $('#actionArea').css('display', 'inline-block');
    $('#divTop').css('display', 'inline-block');
    isChartsView = false;
}

function switchView () {
    var $btnIcon = $(this).find('i');
    $btnIcon.toggleClass('glyphicon-stats');
    $btnIcon.toggleClass('glyphicon-list');
    if (isChartsView) {
        showDetails();
    } else {
        showCharts();
    }
}

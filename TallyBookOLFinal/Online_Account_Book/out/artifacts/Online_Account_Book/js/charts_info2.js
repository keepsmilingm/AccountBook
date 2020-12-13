var myChart = echarts.init(document.getElementById("charts2"));
console.log("hello");
var app = {};
option = null;
var diet=0; //饮食类消费额
var traffic=0;//交通类消费额
var joy=0;//娱乐类消费额
var study=0;//娱乐类消费额
var daily=0;//娱乐类消费额
var others=100;//娱乐类消费额
jQuery.ajax( {
    url:'http://localhost:8080/TallyBookOL/wl/getBills',
    type:'post',
    dataType: 'json',
    data: {
    },
    success:function (resp) {

        for(var i=0;i<resp.result.length;i++){
            switch (resp.result[i].type) {
                case "饮食":
                    diet+=resp.result[i].amount;
                    break;
                case "交通":
                    traffic+=resp.result[i].amount;
                    break;
                case "娱乐":
                    joy+=resp.result[i].amount;
                    break;
                case "学习":
                    study+=resp.result[i].amount;
                    break;
                case "日用":
                    daily+=resp.result[i].amount;
                    break;
                case "其他":
                    others+=resp.result[i].amount;
                    break;
            }
        }
        full();

    },
    error: function () {
        $.fail('失败');
    },
    complete: function () {

    }
});

function full(){
    option = {
        title: {
            text:'消费详情',
            textStyle:{
                //文字颜色
                color:'#8d8d8d',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bold',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:13
            },
            // text: '',
            // subtext: '当前资产使用情况',
            left: 'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
            {
                name:'消费占比',
                type: 'pie',
                radius : '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                right: '30%',
                bottom: '40%',
                label: {
                    normal: {
                        show: true,
                        formatter: "{b}\n{c}\n({d}%)"
                    }
                },
                labelLine: {
                    normal: {show: true}
                },
                data:[
                    {value:-diet/100,    name: '饮食',type:'饮食',itemStyle:{color:'#edcbcd'}},
                    {value:-traffic/100, name: '交通',type:'交通',itemStyle:{color:'#3dcbcd'}},
                    {value:-joy/100,     name: '娱乐',type:'娱乐',itemStyle:{color:'#b9a5df'}},
                    {value:-study/100,   name: '学习',type:'学习',itemStyle:{color:'#60b4f0'}},
                    {value:-daily/100,   name: '日用',type:'日用',itemStyle:{color:'#fbd8bd'}},
                    {value:-others/100,  name: '其他',type:'其他',itemStyle:{color:'#75fbca'}}
                ],

                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
//通过DOM id获取到echarts2实例
    var mycharts2 = echarts.getInstanceByDom(document.getElementById("charts2"));
    window.onresize = function () {
        mycharts2.resize();
    };

    mycharts2.on('click',function(param) {
        console.log(param.data.type);
        $.ajax ({
            url:'http://localhost:8080/TallyBookOL/wl/queryByType',
            type:'post',
            dataType:'json',
            data:{
                type:param.data.type
            },
            success:function (resp) {
                switchView();

                $('#btn-switch').find('i').attr('class','icon glyphicon glyphicon-stats');
                $('#onlySeeBtn').css('display','none');

                getBillsFromServer(function () {
                    bills = resp.result;
                    isSearch = true;
                    idsBuffer = bills;
                    var biss = bills;
                    showBillItems();

                    $('.record').each(function(i) {
                       $(this).attr('id',biss[i].id);
                    });

                    refreshBalance();
                });
            },
            error:function () {
                $.fail('服务器不给数据，你自己处理');
            },
            complete:function () {

            }
        });
    });
}



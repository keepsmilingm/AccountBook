var myChart = echarts.init(document.getElementById("charts1"));
console.log("hello");
var app = {};
option = null;
var moneyIn=0;
var moneyOut=0;
jQuery.ajax( {
    url:'http://localhost:8080/TallyBookOL/wl/getBills',
    type:'post',
    dataType: 'json',
    data: {
    },
    success:function (resp) {
        console.log(resp);


        for(var i=0;i<resp.result.length;i++){
          if(resp.result[i].amount>0)
              moneyIn+=resp.result[i].amount;
          else
              moneyOut+=resp.result[i].amount;
        }
        console.log(moneyOut);
        fulloutline();

    },
    error: function () {
        $.fail('失败');
    },
    complete: function () {

    }
});

function fulloutline(){
    option = {
        title: {
            text:'收支一览',
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
                name:'使用状态',
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
                    {value:moneyIn, name: '收入',itemStyle:{color:'#edcbcd'}},
                    {value:moneyOut, name: '支出',hhh:"http://www.baidu.com",itemStyle:{color:'#3dcbcd'}}

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
//通过DOM id获取到echarts1实例
    var mycharts1 = echarts.getInstanceByDom(document.getElementById("charts1"));
    window.onresize = function () {
        mycharts1.resize();
    };
//饼图点击事件
    mycharts1.on('click', function(param) {
        var url = param.data.hhh;
        console.log(param);
        // console.log(param);
        window.location.href = url;
    });


}

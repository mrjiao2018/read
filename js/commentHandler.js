layui.use(['layer'], function () {
    var layer = layui.layer;

    //检测文中内容是否被选中，若选中后则加载弹窗，对文字进行划线、评论等处理
    function checkSelected(){
        itemContent = $(".item")[0];
        itemContent.onmouseup = function () {
            var selection = window.getSelection();
            var selectStr = selection.toString();

            if (selectStr != null && selectStr != ""){
                layer.open({
                    title:"操作",
                    type:1,
                    btn: ['记笔记', '下划线']
                    ,btn1: function(index, layero){
                        //拷贝selection对象，否则在鼠标进入输入框，取消之前选中文字时，其内容会改变
                        var tempSelection = cloneSelectionObj(selection);
                        var inputContent = "<div><textarea class='inputContent'></textarea></div>";
                        layer.open({
                            title:"请输入笔记",
                            content:inputContent,
                            yes:function(index, layero){
                                var comment = $(".inputContent")[0].value;
                                selectHandler(tempSelection, 'comment', comment);
                                layer.close(index);
                            }
                        });
                        layer.close(index);
                    }
                    ,btn2: function(index, layero){
                        //按钮【按钮二】的回调
                        selectHandler(selection, 'underline', null)

                    }
                    ,cancel: function(){
                        //右上角关闭回调

                        //return false 开启该代码可禁止点击该按钮关闭
                    }
                })
            }

        }
    }

    function selectHandler(selection, type, comment){
        //var p = selection.anchorNode.parentElement;
        var p = selection.anchorNode.parentElement;
        var innerText = p.innerText;

        var underlineStartIndex, underlineEndIndex;
        if (selection.baseOffset < selection.extentOffset){
            underlineStartIndex = selection.baseOffset;
            underlineEndIndex = selection.extentOffset;
        } else{
            underlineStartIndex = selection.extentOffset;
            underlineEndIndex = selection.baseOffset;
        }
        var substring1 = innerText.substring(0, underlineStartIndex);
        var underlineSubstring = innerText.substring(underlineStartIndex, underlineEndIndex);
        var substring2 = innerText.slice(underlineEndIndex);

        var p_handled;
        if(type=='comment'){
            p_handled = $("<p>"+substring1+"<span class='comment' style='color: red'>"
                +underlineSubstring+"</span>"+substring2+"</p>");
        }
        if(type=='underline'){
            p_handled = $("<p>"+substring1+"<span class='underline' style='text-decoration: underline'>"
                +underlineSubstring+"</span>"+substring2+"</p>");
        }

        $(p).after(p_handled);
        $(p).remove();
        //监听鼠标滑过，用来取消下划线和查看评论
        cancelUnderline(p, p_handled);
        showComment(comment);
    }

    function cancelUnderline(p, p_handled){
        var p_underline = $(".underline");
        for(var i = 0; i < p_underline.length; ++i){
            p_underline[i].index = i;
            p_underline[i].onmousemove = function () {
                layer.confirm('请问要取消下划线吗', {
                    btn: ['取消', '不取消']
                }, function(index, layero){
                    //按钮【按钮一】的回调
                    $(p_handled).after(p);
                    $(p_handled).remove();
                    layer.close(index);
                }, function(index){
                    //按钮【按钮二】的回调
                });

            }
        }
    }

    function showComment(comment){
        var p_underline = $(".comment");
        for(var i = 0; i < p_underline.length; ++i){
            p_underline[i].index = i;
            p_underline[i].onmousemove = function () {
                layer.open({
                    title: "笔记内容",
                    content:comment
                })
            }
        }
    }

    $(function () {
        checkSelected();
    })
});

/**
 * tools
 * @param selection
 */
function cloneSelectionObj(selection) {
    var newObj = {
        anchorNode:{}
    };
    newObj.baseOffset = selection.baseOffset;
    newObj.extentOffset = selection.extentOffset;
    newObj.anchorNode.parentElement = selection.anchorNode.parentElement;
    return newObj;
}
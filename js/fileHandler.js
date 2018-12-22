/**
 * 从服务器中加载文本数据
 */
function getTxt() {
    url = "./js/testJson/test.json";
    $.getJSON(url, "", function(data){
        txtHandler(data)
    })
}

/**
 *  对文本的预处理，如分页等
 */
function txtHandler(json) {
    //获取json中的数据
    var txtId = json.txtId;
    var content = json.content;
    var ops = json.ops;

    //截取段落
    var postParagraphs = [];
    var preParagraphs = content.split('\n');
    var page = 0;
    var strLength = 0;
    for (var i=0; i < preParagraphs.length; ++i){
        //txt中的段落
        var paragraph = {
            content:"",
            page:"",
        };

        paragraph.content = preParagraphs[i];
        paragraph.page = page;
        postParagraphs[i] = paragraph;

        //分页，文本内容每过300字加一页
        strLength += paragraph.content.length;
        if(strLength/600 > page)
            page += 1;
    }

    console.log(postParagraphs);

    loadTxtOnPage(postParagraphs);
}

/**
 * 在界面上加载处理好的文本
 */
function loadTxtOnPage(paragraphs) {
    var pageContent = $("#passage");
    for(i = 0; i < paragraphs.length; ++i) {
        var p = $("<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+paragraphs[i].content+"</p>");
        //先只加载第一页
        if(paragraphs[i].page == 1){
            pageContent.append(p);
        }
    }

}

/**
 * 分页
 */
function changePage(){

}

$(function () {
    getTxt();
    changePage();
});
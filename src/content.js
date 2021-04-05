function create_tags(){
    var default_tags = ['survey', 'unread'];
    var output_tags = '';
    for(var i=0; i<default_tags.length; i++){
        // adding # on head
        output_tags += '%23' + default_tags[i] + ' ';
        console.log(default_tags[i])
    }
    // adding \n
    output_tags += '%0a';
    return output_tags;
}

function createNewPage(project, title, body){
    var encoded_body = encodeURI(body);
    var default_tags = create_tags();
    var url = 'https://scrapbox.io/' + project + '/' + title + '?body=' + default_tags + encoded_body;
    var newpage = window.open(url);
    return newpage
}

function extract_paper_description(){
    var description = {};
    description.title = document.getElementsByName('citation_title')[0].content;
    description.author_list = document.getElementsByName('citation_author');

    var date = document.getElementsByName("citation_date")[0].content; // yyyy/mm/dd
    description.year = date.split('/')[0];

    description.pdf_url = document.getElementsByName("citation_pdf_url")[0].content;

    var metaDiscre = document.head.children;
    var metaLength = metaDiscre.length;
    for(var i = 0;i < metaLength;i++){
        var proper = metaDiscre[i].getAttribute('property');
        var cont = metaDiscre[i].content;
        if(proper === 'og:description'){
            var abstract = cont.replace(/\n/g, '');
            abstract = abstract.replace(/\[/g, '(');
            abstract = abstract.replace(/\]/g, ')');
            description.abstract = abstract;
        }else if(proper === 'og:url'){
            description.page_url = cont;
        }
    }

    return description;
}

function process_author_name(raw_name, a, b){
    var raw_name_content = raw_name.content.split(',');
    var processed_name = '[' + raw_name_content[1] + ' ' + raw_name_content[0] + ']';
    return processed_name;
}

function process_author_list(raw_author_list){
    var processed_author_list = [];
    for(var i=0; i<raw_author_list.length; i++){
        processed_author_list.push(process_author_name(raw_author_list[i]));
    }
    return processed_author_list;
}

function create_from_description(description){
    var output = '';

    output += 'Author: ';
    console.log(description.author_list);
    var processed_author_list = process_author_list(description.author_list)
    output += processed_author_list.join(', ') + '\n';

    output += 'Research institute: \n';
    output += 'Year: ' + description.year + '\n';
    output += 'Conference: \n'
    output += 'The problem the authors try to solve: \n';
    output += 'page: <' + description.page_url + '>\n';
    output += 'pdf: <' + description.pdf_url + '>\n';

    output += '>' + description.abstract + '\n\n';

    output += '[** 0. とりあえず一言]\n\n'
    output += '[** 1. どんなもの？]\n\n'
    output += '[** 2. 先行研究と比べてどこがすごい？]\n\n'
    output += '[** 3. 技術や手法のキモはどこ？]\n\n'
    output += '[** 4. どうやって有効だと検証した？]\n\n'
    output += '[** 5. 議論はある？]\n\n'
    output += '[** 6. 次に読むべき論文は？]\n\n'
    output += '[** 7. メモ]\n\n'
    output += '[** 8. コメント]\n\n'

    return output;
}

function extract_and_create_new_page(){
    var description = extract_paper_description();
    var output = create_from_description(description);
    createNewPage('runno-paper', 'test', output);
}

chrome.runtime.sendMessage({from:"content"});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.from === 'background' && request.site === 'arxiv'){
        extract_and_create_new_page();
    }
});


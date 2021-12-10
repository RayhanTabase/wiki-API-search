function errorPage() {
    const errorMessage = document.querySelector("#errorMessage");
    const content = document.querySelector("#content");
    errorMessage.style.display = 'block';
    content.innerHTML = '';
}

function noResultsFound(show) {
    const noResults = document.querySelector("#noResultFound");
    if (show){
        noResults.style.display ="block";
        return;
    }
    noResults.style.display ="none";
}

function loadingContent(show) {
    const loadingContent = document.querySelector("#loadingContent")
    if(show){
        loadingContent.style.display ="flex";
        return;
    }
    loadingContent.style.display ="none";
}

function Wiki() {
    const [showSearchBox, setShowSearchBox] = React.useState(false)
    const [results, setResults] = React.useState([])

    function searchWiki(e){
        e.preventDefault()
        const q = document.querySelector("#queryText-show").value.trim()
        if(!q){
            return 
            
        }
        noResultsFound(false)
        loadingContent(true)
        let url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${q}&limit=10`
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function (data){
                if (data.pages.length < 1) noResultsFound(true)
                setResults([ 
                    ...data.pages.map(res=>{
                        return {"id":res.id, "title":res.title, "excerpt":res.excerpt}
                    })
                ])
                loadingContent(false)
            },
            error: function (){
                errorPage()
                loadingContent(false)
            }
        });
    }

    function displaySearchInput(){
        function reset(){
            setShowSearchBox(!showSearchBox)
            setResults([])
        }
        if(showSearchBox){
            document.querySelector("#queryText-show").id = "queryText-hide"
            setTimeout(function(){ 
                reset()
            }, 1000);
        }else{
            reset()
        }
    }
  
    return(
        <React.Fragment>
            <a id="randomSearch" href="https://en.wikipedia.org/wiki/Special:Random" target="_blank"><p class="randomArticle">Click here for a random article</p></a>
            <div id="searchbox">
                {showSearchBox?
                <form onSubmit={searchWiki}>
                    <div className="input-group mb-3">
                        <input type="search" id="queryText-show" className="form-control" placeholder="search" aria-label="search" aria-describedby="basic-addon2"></input>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" onClick={displaySearchInput}><i class="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </form>
                :
                    <div>
                        <button className="btn-transparent" onClick={displaySearchInput}>
                            <i className="fa fa-search fa-5x" aria-hidden="true"></i>
                        </button> 
                    </div>
                }
            </div>

            {!showSearchBox &&
                <p>
                    click icon to search
                </p>
            }

            <div>
                {results.map(result=>{
                    return(
                        <a href={`https://en.wikipedia.org/?curid=${result.id}`} target="_blank">
                            <div className="search-result" > 
                                <p><strong>{result.title}</strong></p>
                                <div dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                            </div>
                        </a>
                    )
                })}
            </div>
        </React.Fragment>

    );
}

ReactDOM.render(<Wiki />,document.querySelector('#content'));

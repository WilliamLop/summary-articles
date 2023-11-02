import { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {

    const [article, setArticle] = useState({
        url: '',
        summary : '',
    });


    const [allArticles, setAllArticles] = useState([]);
    const [copied, setCopied] = useState();
    const [copiedText, setCopiedText] = useState();

    const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();


    useEffect(() => {
        
    const articleFromLocalStorage = JSON.parse(
        localStorage.getItem("articles"))

    if(articleFromLocalStorage){
        setAllArticles(articleFromLocalStorage)
    }

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await getSummary ({articleUrl: article.url });

        if(data?.summary){
            const newArticle = {...article, summary: data.summary};

            const updateAllArticles = [newArticle, ...allArticles]

            setArticle(newArticle)
            setAllArticles(updateAllArticles);

            localStorage.setItem('articles', JSON.stringify (updateAllArticles));
        }

    }

    const handleCopy = (copyUrl) => {
        setCopied(copyUrl);
        navigator.clipboard.writeText(copyUrl);
        setTimeout(() => setCopied(false), 3000)
    }
    const handleCopyText = (copyText) => {
        setCopiedText(copyText);
        navigator.clipboard.writeText(copyText);
        setTimeout(() => setCopiedText(false), 10000)
    }

    return (
        <section className="mt-16 w-full max-w-xl">
            {/* Search */}
            <div className="flex flex-col w-full gap-2">
            <form 
                action=""
                className="relative flex justify-center items-center"
                onSubmit={ handleSubmit}
            >
                <img 
                    src={linkIcon} 
                    alt="link-icon" 
                    className="absolute left-0 my-2 ml-3 w-5"
                />

                <input 
                    type="url" 
                    name="" 
                    id="" 
                    value={article.url}
                    placeholder="Entra tu URL"
                    className="url_input peer"
                    onChange={(e) => setArticle({ ...article, url: e.target.value })}
                    required
                />
                
                <button
                    type="submit"
                    className="submit_btn peer-focus:border-gray-700
                    peer-focus:text-gray-700"
                >
                    🔎
                </button>

            </form>
                {/* Broser URL History */}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {allArticles.map((item, index) => (
                    <div
                    key={`link-${index}`}
                    className="link_card"
                    onClick={() => setArticle(item)}
                    >

                        <div className="flex w-full items-center gap-3"
                        onClick={() => handleCopy(item.url)}>
                            <img 
                                src={copied === item.url ? tick : copy}
                                alt="copy_icon" 
                                className="w-[40]
                                h-[40%] object-contain"
                                title="Copiar"
                            />
                            <p className="flex-1 font-satoshi text-blue-600
                            font-medium text-sm truncate">
                                {item.url}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

                
            </div>
                {/* Display Results */}

                <div className="my-10 max-w-full flex justify-center items-center">
                    {isFetching ? (
                        <img src={loader} alt="loader"
                        className="w-20 h-20 object-contain" />
                    ): error ? (
                        <p className="font-inter font-bold text-black
                        text-center">
                            Bueno, se suponía que eso no iba a pasar...
                            <br />
                            <span className="font-satoshi font-normal text-gray-700">
                                {error?.data?.error}
                            </span>
                        </p>
                    ) : (
                        article.summary && (
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center"
                                onClick={() => handleCopyText(article.summary)}>
                                    <h2 className="font-satoshi font-bold flex gap-2 text-gray-600 text-xl">
                                        Resumen de
                                        <span className="blue_gradient">
                                        articulo
                                        </span>
                                    </h2>

                                    <img 
                                    src={copiedText === article.summary ? tick : copy}
                                    alt="copy_icon" 
                                    className="w-[20px] cursor-pointer
                                    h-[20px] object-contain"
                                    title="Copiar"
                                    />
                                </div>

                                <div className="summary_box">
                                    <p
                                    className="font-inter font-medium text-sm
                                    text-gray-700 leading-7"
                                    >{article.summary}</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
        </section>
    )
}

export default Demo
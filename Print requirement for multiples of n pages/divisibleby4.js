function autoFillPages(params) {
    if (!params) {
        params = {};
    }

    const multiple = params.multiple || 2;
    const target = params.target || "body";
    const template = params.template || null;

    // Check whether the required JS API exists
    if (window.ro === undefined || window.ro.layout === undefined) {
        return;
    }

    const roFillerPage = "roFillerPage";
    
    const currentPageCount = ro.layout.numberOfPages;
    let pagesToInsert = 0;
    
    // How many pages do we need?
    const pageMod = parseInt(multiple);
    
    if (!Number.isNaN(pageMod) && pageMod > 0) {
        const currentPageMod = currentPageCount % pageMod;

        if (currentPageMod) {
            pagesToInsert = pageMod - (currentPageCount % pageMod);
        }
    } else {
        throw "Param 'multiple' must be positive integer.";
    }
    
    // Begin inserting pages
    if (pagesToInsert > 0) {
        const targetElement = document.querySelector(target);
        
        if (!targetElement) {
            throw "Insertion target not found from param 'target'.";
        }
        
        for (let i = 0; i < pagesToInsert; i++) {
            let fillerPage = null;
            
            if (template) {
                if (template instanceof Function) {
                    fillerPage = template(i, pagesToInsert, currentPageCount);

                    if (fillerPage === null || fillerPage === undefined) {
                        continue;
                    }
                    
                    if (!(fillerPage instanceof HTMLElement)) {
                        throw "Param function 'template' must return an HTMLElement.";
                    }
                } else {
                    throw "Param 'template' must be a function.";
                }
            } else {
                fillerPage = document.createElement(roFillerPage);
            }
            
            // Always add class and some basic styles
            fillerPage.className         = roFillerPage;
            fillerPage.style.page        = roFillerPage;
            fillerPage.style.display     = "block";
            fillerPage.style.breakBefore = "page";
            
            targetElement.appendChild(fillerPage);
        }
    }
};

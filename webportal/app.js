function getFavicon(url){

    try{

        const host =
            new URL(url).hostname;

        return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;

    }catch{

        return "";

    }

}

fetch("bookmarks.json")

.then(response => response.json())

.then(data => {

    const portal =
        document.getElementById("portal");

    data.categories.forEach(category => {

        const section =
            document.createElement("div");

        section.className = "section";

        section.innerHTML = `
            <h2>${category.name}</h2>
            <div class="row">
                ${category.items.map(item => `
                    <a
                        class="card"
                        href="${item.url}"
                        target="_blank"
                        rel="noopener noreferrer">

                        <img src="${getFavicon(item.url)}">

                        <div>
                            ${item.title}
                        </div>

                    </a>
                `).join("")}
            </div>
        `;

        portal.appendChild(section);

    });

})

.catch(error => {

    console.error(error);

});
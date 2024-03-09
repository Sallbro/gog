const { axios } = require('axios');
const { Cheerio } = require('cheerio');
const express = require('express');
const { features } = require('process');
const app = express();
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env['PORT'] || 9331;

//initial request
app.get('/', (req, res) => {
    try {
        res.status(200).send("succ!");

    } catch (err) {
        res.status(400).send("error!");
    }
});

//search 
app.get('/game/search/:sugg', (req, res) => {
    const sugg = req.params.sugg;
    console.log("sugg ", sugg);
    let url = process.env['SEARCH_GAME_URL'];
    url = url.replace("${sugg}", sugg);

    axios.get(url).then((response) => {
        const result = [];
        for (x of response.data.products) {
            let obj_result = {};
            obj_result.id = x.id;
            obj_result.name = x.slug;

            //releaseDate
            obj_result.ReleaseDate = x.releaseDate;

            //price 
            let price = {};
            price.price = x.price?.base;
            price.original_price = x.price?.final;
            price.discount = x.price?.discount;
            obj_result.price = price;

            //images
            let images = {};
            images.coverHorizontal = x.coverHorizontal;
            images.coverVertical = x.coverVertical;
            obj_result.images = images
            //  screenshots
            const screenshots = [];
            for (z of x.screenshots) {
                screenshots.push(z?.replace("_{formatter}", ""));
            }
            obj_result.screenshots = screenshots;

            //features
            obj_result.features = [];
            for (y of x.features) {
                obj_result.features.push(y.name);
            }

            // developers
            obj_result.developers = x.developers;
            // publisher
            obj_result.publishers = x.publishers;
            // system 
            obj_result.operatingSystems = x.operatingSystems;

            // genres
            const genres = [];
            for (gnr of x.genres) {
                genres.push(gnr.name);
            }
            obj_result.genres = genres;

            // tags
            const tags = [];
            for (tag of x.tags) {
                tags.push(tag.name);
            }
            obj_result.tags = tags;

            //final result
            result.push(obj_result);
        }
        res.send(result);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        res.status(400).send("sommething went wrong!");

    });

});

//page 
app.get('/game/pageno/:no', (req, res) => {
    const page_no = req.params.no;
    let url = process.env['PAGE_URL'];
    url = url.replace("${page_no}", page_no);

    axios.get(url).then((response) => {
        const result = [];
        for (x of response.data.products) {
            let obj_result = {};
            obj_result.id = x.id;
            obj_result.name = x.slug;
            obj_result.features = [];
            for (y of x.features) {
                obj_result.features.push(y.name);
            }
            obj_result.developers = x.developers;
            obj_result.publishers = x.publishers;
            obj_result.operatingSystems = x.operatingSystems;

            //images
            let images = {};
            images.coverHorizontal = x.coverHorizontal;
            images.coverVertical = x.coverVertical;
            obj_result.images = images
            //  screenshots
            const screenshots = [];
            for (z of x.screenshots) {
                screenshots.push(z?.replace("_{formatter}", ""));
            }
            obj_result.screenshots = screenshots;

            //releaseDate
            obj_result.ReleaseDate = x.releaseDate;

            //price 
            let price = {};
            price.price = x.price?.base;
            price.original_price = x.price?.final;
            price.discount = x.price?.discount;
            obj_result.price = price;

            // genres
            const genres = [];
            for (gnr of x.genres) {
                genres.push(gnr.name);
            }
            obj_result.genres = genres;

            // tags
            const tags = [];
            for (tag of x.tags) {
                tags.push(tag.name);
            }
            obj_result.tags = tags;

            //final result
            result.push(obj_result);
        }
        res.send(result);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        res.status(400).send("sommething went wrong!");
    });

});

//type 
app.get('/game', (req, res) => {
    const genres = req.query.genres;
    const releaseStatuses = req.query.releaseStatuses;
    const features = req.query.features;
    const systems = req.query.systems;
    const tags = req.query.tags;
    const releaseDateRange = req.query.releaseDateRange;
    const priceRange = req.query.priceRange;
    const folio = req.query.folio;
    let url = process.env['GAME_TYPE_URL'];

    if (genres != undefined && genres != "") {
        const arr_genres = genres.split(",");
        if (arr_genres.length > 0) {
            let str_genres = `&genres=in%3A${arr_genres[0]}`;
            for (let i = 1; i < arr_genres.length; i++) {
                str_genres += `%2C${arr_genres[i]}`;
            }
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_genres);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_genres);
                url = url.replace("${folio}", 1);
            }
        }
    }
    else if (releaseStatuses != undefined && releaseStatuses != "") {
        const arr_releaseStatuses = releaseStatuses.split(",");
        if (arr_releaseStatuses.length > 0) {
            let str_releaseStatuses = `&releaseStatuses=in%3A${arr_releaseStatuses[0]}`;
            for (let i = 1; i < arr_releaseStatuses.length; i++) {
                str_releaseStatuses += `%2C${arr_releaseStatuses[i]}`;
            }
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_releaseStatuses);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_releaseStatuses);
                url = url.replace("${folio}", 1);
            }
        }
    }
    else if (features != undefined && features != "") {
        const arr_features = features.split(",");
        if (arr_features.length > 0) {
            let str_features = `&features=in%3A${arr_features[0]}`;
            for (let i = 1; i < arr_features.length; i++) {
                str_features += `%2C${arr_features[i]}`;
            }
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_features);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_features);
                url = url.replace("${folio}", 1);
            }
        }

    }
    else if (systems != undefined && systems != "") {
        const arr_systems = systems.split(",");
        if (arr_systems.length > 0) {
            const index = arr_systems.indexOf("mac");
            if (index !== -1) {
                arr_systems[index] = 'osx';
            }
            let str_systems = `&systems=in%3A${arr_systems[0]}`;
            for (let i = 1; i < arr_systems.length; i++) {
                str_systems += `%2C${arr_systems[i]}`;
            }
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_systems);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_systems);
                url = url.replace("${folio}", 1);
            }
        }

    }
    else if (tags != undefined && tags != "") {
        const arr_tags = tags.split(",");
        if (arr_tags.length > 0) {
            let str_tags = `&tags=in%3A${arr_tags[0]}`;
            for (let i = 1; i < arr_tags.length; i++) {
                str_tags += `%2C${arr_tags[i]}`;
            }
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_tags);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_tags);
                url = url.replace("${folio}", 1);
            }
        }
    }
    else if (releaseDateRange != undefined && releaseDateRange != "") {
        const arr_releasedate = releaseDateRange.split(",");
        if (arr_releasedate.length >= 2) {
            let str_releaseDate = `&releaseDate=between%3A${arr_releasedate[0]}%2C${arr_releasedate[1]}`;
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_releaseDate);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_releaseDate);
                url = url.replace("${folio}", 1);
            }
        }
    }
    else if (priceRange != undefined && priceRange != "") {
        const arr_priceRange = releaseDateRange.split(",");
        if (arr_priceRange.length >= 2) {
            let str_priceRange = `&price=between%3A${arr_priceRange[0]}%2C${arr_priceRange[1]}`;
            if (folio != undefined && folio != "") {
                url = url.replace("${game_type}", str_priceRange);
                url = url.replace("${folio}", folio);
            }
            else {
                url = url.replace("${game_type}", str_priceRange);
                url = url.replace("${folio}", 1);
            }
        }
    }
    else {
        if (folio != undefined && folio != "") {
            url = url.replace("${game_type}", "&");
            url = url.replace("${folio}", folio);
        }
        else {
            url = url.replace("${game_type}", "&");
            url = url.replace("${folio}", 1);
        }
    }

    axios.get(url).then((response) => {
        const result = [];
        for (x of response.data.products) {
            let obj_result = {};
            obj_result.id = x.id;
            obj_result.name = x.slug;
            obj_result.features = [];
            for (y of x.features) {
                obj_result.features.push(y.name);
            }
            obj_result.developers = x.developers;
            obj_result.publishers = x.publishers;
            obj_result.operatingSystems = x.operatingSystems;

            //images
            let images = {};
            images.coverHorizontal = x.coverHorizontal;
            images.coverVertical = x.coverVertical;
            obj_result.images = images
            //  screenshots
            const screenshots = [];
            for (z of x.screenshots) {
                screenshots.push(z?.replace("_{formatter}", ""));
            }
            obj_result.screenshots = screenshots;

            //releaseDate
            obj_result.ReleaseDate = x.releaseDate;

            //price 
            let price = {};
            price.price = x.price?.base;
            price.original_price = x.price?.final;
            price.discount = x.price?.discount;
            obj_result.price = price;

            // genres
            const genres = [];
            for (gnr of x.genres) {
                genres.push(gnr.name);
            }
            obj_result.genres = genres;

            // tags
            const tags = [];
            for (tag of x.tags) {
                tags.push(tag.name);
            }
            obj_result.tags = tags;

            //final result
            result.push(obj_result);
        }
        res.send(result);
        // res.send(response.data);
        res.end();
    }).catch((err) => {
        res.status(400).send("sommething went wrong!");
    });

});

//single game
app.get("/game/:game_id", (req, res) => {
    const game_id = req.params.game_id;
    let url = process.env['SINGLE_GAME_URL'];
    url = url.replace("${singlegame_id}", game_id);

    axios.get(url).then((response) => {
        const res_data = response.data;
        const $ = cheerio.load(res_data.description);
        const product = res_data._embedded.product;

        let obj_result = {};

        obj_result.id = product.id;
        obj_result.name = product.title;

        //description
        let desc_str = res_data.description;
        let descript = desc_str.slice(desc_str.indexOf('<h4>') + 4).replace("\n", "");
        console.log("descript-", descript);
        obj_result.desc = descript;

        //ageRating
        obj_result.ageRating = res_data._embedded?.gogRating?.ageRating;

        //cover image
        const cover_img = {};
        cover_img.horizontal = product._links.image.href.replace("_{formatter}", "")
        cover_img.vertical = res_data._links.boxArtImage.href;
        cover_img.icon = res_data._links.icon.href;
        obj_result.cover_img = cover_img;

        //languages supported
        const languages = [];
        for (lang of res_data._embedded.localizations) {
            languages.push(lang._embedded.language.name);
        }
        obj_result.languages = languages;

        //screenshots
        const screenshots = [];
        for (scrn of res_data._embedded.screenshots) {
            screenshots.push(scrn._links.self.href.replace("_{formatter}", ""));
        }
        obj_result.screenshots = screenshots;

        //videos
        const videos = [];
        for (vds of res_data._embedded.videos) {
            videos.push(vds._links.self.href);
        }
        obj_result.videos = videos;

        //developers
        const developers = [];
        for (devp of res_data._embedded.developers) {
            developers.push(devp.name);
        }
        obj_result.developers = developers;

        //publisher
        const publisher = [];
        publisher.push(res_data._embedded.publisher.name)
        obj_result.publisher = publisher;

        //tags
        const tags = [];
        for (tag of res_data._embedded.tags) {
            tags.push(tag.name)
        }
        obj_result.tags = tags;

        //properties
        const features = [];
        for (fture of res_data._embedded.features) {
            features.push(fture.name)
        }
        obj_result.features = features;

        //properties
        const properties = [];
        for (propt of res_data._embedded.properties) {
            properties.push(propt.name)
        }
        obj_result.properties = properties;

        //system requirements
        const system_requirements = {};
        for (system of res_data._embedded.supportedOperatingSystems) {
            //get type 
            let sys_type = {};
            for (sys_req of system.systemRequirements) {
                //get type data(min,rec)
                let sys_data = {};
                for (req of sys_req.requirements) {
                    sys_data[req.name] = req.description;
                }
                sys_type[sys_req.type] = sys_data;
            }
            //add type to os(operating system)
            if (system.operatingSystem.name == 'osx') {
                system_requirements['mac'] = sys_type;
            }
            else {
                system_requirements[system.operatingSystem.name] = sys_type;
            }
        }
        obj_result.system_requirements = system_requirements;

        //send response
        res.send(obj_result);
        res.end();
    }).catch((err) => {
        res.status(400).send("sommething went wrong!");
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


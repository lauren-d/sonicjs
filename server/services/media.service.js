var dataService = require('./data.service');
var helperService = require('./helper.service');
var emitterService = require('./emitter.service');
var globalService = require('./global.service');

var fs = require('fs');
const axios = require('axios');
const ShortcodeTree = require('shortcode-tree').ShortcodeTree;
const chalk = require('chalk');
const fileService = require('./file.service');
const log = console.log;
var axiosInstance;


module.exports = mediaService = {

    startup: async function () {
        emitterService.on('getRenderedPagePostDataFetch', async function (options) {
            if (options && options.page) {
                await mediaService.processHeroImage(options.page);
            }
        });

        emitterService.on('requestBegin', async function (options) {
            // console.log('data service startup')
            if(options){
                let baseUrl = globalService.baseUrl;
                // console.log('data service ' + baseUrl)
                axiosInstance = axios.create({ baseURL: baseUrl });
            }
        });
    },

    processHeroImage: async function (page) {
        // if (page.data.heroImage[0]) {
        //     page.data.heroImage = page.data.heroImage[0].originalName;
        // }

        let jumbotronStyle = "background:pink;"
        page.data.jumbotronStyle = jumbotronStyle;
    },

    getMedia: async function () {

        let mediaFilesList = fileService.getFilesSync('/server/assets/uploads');

        let media = mediaFilesList.map(function(media) {
            return {filePath: media};
        });

        return media;
        // let url = '/api/containers/files/files';
        // return axiosInstance.get(url)
        // .then(async function (record) {
        //     if (record.data) {
        //         return record.data;
        //     }
        //     return 'not found';
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    },

    addMediaUrl: async function (mediaList) {
        mediaList.forEach(media => {
            media.data.url = `/api/containers/files/download/${media.data.file}`;
            media.data.thumbUrl = `/images/${media.data.file}?width=240`;
        });
    }
}

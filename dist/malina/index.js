const axios = require("axios");
const cheerio = require('cheerio');

module.exports = {
    platform: "malina", // 插件名
    version: "0.0.1", // 版本号
    cacheControl: "no-store", // 我们可以直接解析出musicItem的结构，因此选取no-store就好了，当然也可以不写这个字段
    async search(query, page, type) {
        if (type === "music") {
            // 我们能搜索的只有音乐，因此判断下类型
            // 获取网站的html
            const rawHtml = (
                await axios.get("https://zvu4no.org/tracks/" + escape(query) + "/" + page)
            ).data;

            // 接下来解析html 
            const $ = cheerio.load(rawHtml);
            // 存储搜索结果 
            const searchResults = [];
            // 获取所有的结果
            const resultElements = $('.f-table');
            // 解析每一个结果
            resultElements.each((index, element) => {
                const playerElement = $(element).find('.artist-name');
                // id
                const id = $(element).find('.mp3').attr("href");
                // 音频名
                const title = $(element).find('.track-name').text();
                // 作者
                const artist = $(element).find('.artist-name').text();
                // 专辑封面
                const artwork = 'https:' + $($('.c-img')[0]).find('img').attr('src');
                // 音源
                const url = 'https:' + $(element).find('.mp3').attr("href");
                // 专辑名，这里就随便写个了，不写也没事
                const album = '';

                searchResults.push({
                    // 一定要有一个 id 字段
                    id,
                    title,
                    artist,
                    artwork,
                    album,
                    url
                })
            });
            return {
                isEnd: $('#p-container').find('.p-text').last().text() <= page,
                data: searchResults
            }
        }
    },
};

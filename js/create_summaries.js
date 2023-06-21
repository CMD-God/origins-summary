
var origins_language_data;
var my_powers;
var my_origins;

const PLURAL_LAYER_NAMES = {
    "origins:origin" : "Origins",
    "mage_specializations": "Mage Specializations"
};

function createOriginLists(layers) {
    var layer_list = [];
    for (key in layers) {
        layers[key].key = key;
        layer_list.push(layers[key]);
    }
    layer_list.sort((a, b) => {return a.order - b.order;});
    console.log(layer_list);
    var origin_lists = [];
    for (var i=0; i < layer_list.length; i++) {
        var layer = layer_list[i];
        var list = [];
        for (var j=0; j < layer.origins.length; j++) {
            var origin_obj = layer.origins[j];
            if (typeof(origin_obj) == "string") {
                list.push(origin_obj);
            } else {
                list = list.concat(origin_obj.origins);
            }
        }
        var origin_list_obj = {
            "display_name" : PLURAL_LAYER_NAMES[layer.key] || layer.key,
            "origins" : list
        };
        origin_lists.push(origin_list_obj);
    }
    return origin_lists;
}

function followSlashObjects(parent = {}, path = "") {
    var split_path = path.split("/");
    for (var i=0; i < split_path.length -1; i++) {
        parent = parent[split_path[i] + "/"];
    }
    return parent[split_path[split_path.length-1]];
}

function fetchNameAndDescForPower(power_id = "") {
    var name;
    var desc;
    var bits = power_id.split(":");
    var namespace = bits[0];
    var id = bits[1];
    if (!(namespace === "ucr_stitch")) {
        // We assume the power is from Origins.
        name = origins_language_data[`power.origins.${id}.name`] || "";
        desc = origins_language_data[`power.origins.${id}.description`] || "";
    } else {
        var power = followSlashObjects(my_powers, id);
        if (power.hidden) {
            name = "";
            desc = "";
        } else {
            name = power.name;
            desc = power.description;
        }
    }

    return {name: name, desc: desc};
}

function powerListHtml(powers = []) {
    var html = "";
    powers.forEach((power_id) => {
        var name_and_desc = fetchNameAndDescForPower(power_id);
        if (name_and_desc.name !== "" && name_and_desc.desc !== "") {
            html += `<h2>${name_and_desc.name}</h2><p>${name_and_desc.desc}</p>`;
        }
    })
    return html;
}

function createHtmlForOrigin(origin_id = "") {
    var bits = origin_id.split(":");
    var namespace = bits[0];
    var id = bits[1];
    
    var origin_obj = followSlashObjects(my_origins, id);
    var origin_name = origin_obj.name || origins_language_data[`origin.origins.${id}.name`];
    var origin_desc = origin_obj.description || origins_language_data[`origin.origins.${id}.description`];
    
    var html = `<div class="origin"><h1>${origin_name}</h1><p>${origin_desc}</p><div class="small_sep"></div>${powerListHtml(origin_obj.powers)}</div>`;
    return html;
}

$.getJSON("./origins_en_us.json", {}, (lan_data) => {
    origins_language_data = lan_data;
    $.getJSON("./UCR_Origins_Backup.json", {}, (data) => {
        my_powers = data["powers/"];
        my_origins = data["origins/"];
        var layers = data["origin_layers/"];
        var origin_lists = createOriginLists(layers);
        origin_lists.forEach((list_obj) => {
            var title = $(`<h1 class="origin_layer_title">${list_obj.display_name}</h1>`);
            var origins = $(`<div class="origin_list">${list_obj.origins.map((o) => {return createHtmlForOrigin(o)}).join("")}</div>`);
            $("body").append(title).append(origins);
        })
    });
});

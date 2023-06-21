
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
                list.push(origin_list_obj);
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

$.getJSON("./UCR_Origins_Backup.json", {}, (data) => {
    console.log(data);
    var layers = data["origin_layers/"];
    var origin_lists = createOriginLists(layers);
    console.log(origin_lists);
});
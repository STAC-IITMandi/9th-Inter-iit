import numpy as np
import matplotlib.pyplot as plt
import mpld3
from mpld3 import utils
from mpld3 import plugins
import random
import string
import ssl
import urllib.request, urllib.error
import requests, json

# ignoring ssl error
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# mpld3.enable_notebook()

try:
    api_dataset = "http://127.0.0.1:8080/dataset"
    res = requests.get(api_dataset)
    js = res.json()
except:
    fh = urllib.request.urlopen(api_dataset, context=ctx)
    data = fh.read().decode()
    js = json.loads(data)

# print(js["objects"][0]["GLON"])

# Galactic coordinates
# GLON = []
# GLAT = []
# Names = []
# for i in range(len(js["objects"])):
#     GLON.append(float(js["objects"][i]["GLON"]))
#     GLAT.append(float(js["objects"][i]["GLAT"]))
#     Names.append(js["objects"][i]["Name"])


class ClickInfo(plugins.PluginBase):
    """Plugin for getting info on click"""

    JAVASCRIPT = """
    mpld3.register_plugin("clickinfo", ClickInfo);
    ClickInfo.prototype = Object.create(mpld3.Plugin.prototype);
    ClickInfo.prototype.constructor = ClickInfo;
    ClickInfo.prototype.requiredProps = ["id", "labels"];
    function ClickInfo(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };
    
    ClickInfo.prototype.draw = function(){
                var obj = mpld3.get_element(this.props.id);
                labels = this.props.labels;
                obj.elements().on("mousedown",
                    function(d, i) {
                        var element = document.getElementById("showdata");
                        element.innerHTML = labels[i];
                    });
    }
    """

    def __init__(self, points, labels):
        self.labels = labels
        self.dict_ = {"type": "clickinfo", "id": utils.get_id(points), "labels": labels}


# plot graph here
fig, ax = plt.subplots()

points = ax.scatter(np.random.rand(40), np.random.rand(40), s=300, alpha=0.3)
N = 5
# list of source name to display corresponding to each point
labels = [
    "{0}".format("".join(random.choices(string.ascii_uppercase + string.digits, k=N)))
    for i in range(40)
]
# points = ax.scatter(GLON, GLAT, s=300, alpha=0.3)
# labels = Names

tooltip = plugins.PointLabelTooltip(points, labels)
plugins.clear(fig)  # clear all plugins from the figure
plugins.connect(fig, tooltip)
plugins.connect(fig, plugins.Reset(), plugins.BoxZoom(), plugins.Zoom())
plugins.connect(fig, ClickInfo(points, labels))

# print fig_id and save JS stuff to html
js_script = mpld3.fig_to_html(fig, template_type="simple")
tmp, js_script = js_script.split("</style>")[-1].split("</div>")
tmp = tmp.strip()
tmp = tmp[tmp.find("fig_") : -2 :]
js_script = js_script.split("\n\n", 1)[-1].split("</script>")[0].strip()
print(tmp)
js_file = open("plot.js", "w")
js_file.write(js_script)
js_file.close()

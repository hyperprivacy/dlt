//required packages
var util = require("util"),
  path = require("path"),
  hfc = require("fabric-client"),
  //network organiyations definition
  organizations = ["Supervisor", "Provider", "Iot", "EndUser"],
  //environment and network connection profile definition
  file = "connection-profile.yaml";

//network configuration connection profile setup
hfc.setConfigSetting(
  "network-connection-profile",
  path.join(__dirname, "network/src/config", file)
);

organizations.forEach(organization => {
  // indicate to the application where the setup file is located so it able
  // to have the hfc load it to initalize the fabric client instance
  hfc.setConfigSetting(
    organization,
    path.join(
      __dirname,
      "network/src/config/wallet",
      organization.toLowerCase() + ".yaml"
    )
  );
});

// some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, "config.json"));

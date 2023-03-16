"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`http://localhost:${3e3}/esbuild`).addEventListener(
    "change",
    () => location.reload()
  );

  // src/request-a-contract.ts
  var memberstack = window.$memberstackDom;
  memberstack.getCurrentMember().then(({ data: member }) => {
    if (member) {
      const memberstackIDInput = document.querySelector("#memberstack_id");
      if (!memberstackIDInput)
        return;
      memberstackIDInput.value = member.id;
    }
  });
  var purchaserSelect = document.querySelector('[data-element="Purchaser"]');
  purchaserSelect?.addEventListener("change", (e) => {
    e.preventDefault();
    const thisValue = e.target.value;
    const jointElement = document.querySelector('[data-purchaser="Joint"]');
    if (thisValue === "Joint")
      jointElement?.classList.remove("hide");
    if (thisValue === "Single")
      jointElement?.classList.add("hide");
  });
  var buyingEntityTypeSelect = document.querySelector('[data-element="Buying Entity Type"]');
  buyingEntityTypeSelect?.addEventListener("change", (e) => {
    e.preventDefault();
    const thisValue = e.target.value;
    const buyingEntityNameElement = document.querySelector('[data-element="Buying Entity Name"]');
    if (thisValue !== "Named above")
      buyingEntityNameElement?.classList.remove("hide");
    if (thisValue === "Named above" || thisValue === "")
      buyingEntityNameElement?.classList.add("hide");
  });
  var properties = [];
  document.querySelectorAll('[data-element="listing-item"]').forEach((value) => {
    const listingAddress = value.querySelector('[data-element="listing-address"]')?.textContent;
    const listingAirtable = value.querySelector('[data-element="listing-airtable"]')?.textContent;
    const property = { address: listingAddress, airtable: listingAirtable };
    if (property)
      properties.push(property);
  });
  document.querySelectorAll('[data-element="listing-item2"]').forEach((value) => {
    const listingAddress = value.querySelector('[data-element="listing-address2"]')?.textContent;
    const listingAirtable = value.querySelector('[data-element="listing-airtable2"]')?.textContent;
    const property = { address: listingAddress, airtable: listingAirtable };
    if (property)
      properties.push(property);
  });
  var autoCompleteJS = new autoComplete({
    placeHolder: "Search for listing...",
    data: {
      src: properties,
      keys: ["address"],
      cache: true
    },
    resultItem: {
      highlight: true
    },
    events: {
      input: {
        selection: (event) => {
          const selection = event.detail.selection.value;
          autoCompleteJS.input.value = selection;
        }
      }
    }
  });
  document.querySelector("#autoComplete")?.addEventListener("selection", function(event) {
    const feedback = event.detail;
    autoCompleteJS.input.blur();
    const selection = feedback.selection.value[feedback.selection.key];
    autoCompleteJS.input.value = selection;
    const tableName = feedback.selection.value["airtable"];
    getPropertyData(tableName).then((data) => processData(data));
  });
  var agents = [];
  document.querySelectorAll('[data-element="agent-item"]').forEach((value) => {
    const agentFullName = value.querySelector('[data-element="agent-first-name"]')?.textContent + " " + value.querySelector('[data-element="agent-last-name"]')?.textContent;
    if (agentFullName)
      agents.push(agentFullName);
  });
  var autoCompleteJSAgents = new autoComplete({
    selector: "#Purchaser-Agent",
    placeHolder: "Search for Agents...",
    data: {
      src: agents,
      cache: true
    },
    resultItem: {
      highlight: true
    },
    events: {
      input: {
        selection: (event) => {
          const selection = event.detail.selection.value;
          autoCompleteJSAgents.input.value = selection;
        }
      }
    }
  });
  async function getPropertyData(tableName, tableViewName) {
    let tableURL;
    tableName = htmlDecode(tableName) || "";
    if (tableViewName) {
      tableViewName = htmlDecode(tableViewName) || "";
      tableURL = "https://api.airtable.com/v0/appWNf6XfqAR6n0oT/" + encodeURIComponent(tableName) + "?api_key=keyUxdcC40qxNrt1Y&&view=" + encodeURIComponent(tableViewName).replace(/%20/g, "+");
    } else {
      tableURL = "https://api.airtable.com/v0/appWNf6XfqAR6n0oT/" + encodeURIComponent(tableName) + "?api_key=keyUxdcC40qxNrt1Y&";
    }
    const response = await fetch(tableURL);
    const responseJson = await response.json();
    return responseJson;
  }
  var processData = (data) => {
    const targetDropDown = document.querySelector(
      '[data-element="AvailableUnits"]'
    );
    if (!targetDropDown)
      return;
    const optionsLength = targetDropDown.options.length - 1;
    let i;
    for (i = optionsLength; i >= 1; i--) {
      targetDropDown.remove(i);
    }
    const dataRecords = data["records"];
    const dataUnits = [];
    if (!dataRecords)
      return;
    dataRecords.forEach((obj) => {
      const newText = "Unit " + obj.fields["Unit/Lot"] + " - $" + numberWithCommas(obj.fields.Price) + " / " + (obj.fields.Land ? obj.fields.Land : "") + (obj.fields.Land ? "sqm / " : "") + obj.fields.Beds + " / " + obj.fields.Baths + " / " + obj.fields["Car Park"];
      dataUnits.push(newText);
    });
    dataUnits.sort(naturalCompare);
    dataUnits.forEach((unit) => {
      const newOption = document.createElement("option");
      newOption.text = unit + "";
      newOption.value = unit + "";
      targetDropDown?.add(newOption);
    });
  };
  var addyKey = "a95d779bec144d448ebcafccdec4ce61";
  function initAddy() {
    const addyComplete = new AddyComplete(document.getElementById("main-address"));
    addyComplete.options.excludePostBox = false;
    addyComplete.fields = {
      address1: document.getElementById("main-address"),
      address2: document.getElementById("main-address2"),
      city: document.getElementById("main-city"),
      postcode: document.getElementById("main-postcode"),
      suburb: document.getElementById("main-suburb")
    };
  }
  (function(d, w) {
    const s = d.createElement("script");
    const addyUrl = "https://www.addysolutions.com/address-lookup/1.6.2/js/addy.min.js";
    s.src = addyUrl + "?loadcss=true&enableLocation=false&country=nz&nzKey=" + addyKey;
    s.type = "text/javascript";
    s.async = 1;
    s.onload = initAddy;
    d.body.appendChild(s);
  })(document, window);
  var createRadioElement = (radioElementTemplate, radioText, radioValue) => {
    const newRadio = radioElementTemplate?.cloneNode(true);
    const label = newRadio.querySelector("span");
    const radioInput = newRadio.querySelector("input");
    if (!label || !radioInput)
      return;
    label.textContent = radioText.toString();
    radioInput.value = radioValue.toString();
    return newRadio;
  };
  var renderRadio = (dataElement, radioElementTemplate, radioType) => {
    const radioElementParent = radioElementTemplate?.parentElement;
    radioElementTemplate?.remove();
    dataElement.forEach((value, key, array) => {
      const valuElement = value;
      const radioText = "Yes - " + valuElement.querySelector('[data-element="' + radioType + ' Location"]')?.textContent + (radioType !== "Lawyer" ? " " : ": ") + valuElement.querySelector('[data-element="' + radioType + ' Name"]')?.textContent + " at " + valuElement.querySelector('[data-element="' + radioType + ' Firm"]')?.textContent + " (" + valuElement.querySelector('[data-element="' + radioType + ' Email"]')?.textContent + " / " + valuElement.querySelector('[data-element="' + radioType + ' Phone"]')?.textContent + ") ";
      const radioValue = valuElement.querySelector('[data-element="' + radioType + ' Location"]')?.textContent + ": " + valuElement.querySelector('[data-element="' + radioType + ' Name"]')?.textContent + " at " + valuElement.querySelector('[data-element="' + radioType + ' Firm"]')?.textContent;
      if (radioElementTemplate) {
        const newRadioElement = createRadioElement(radioElementTemplate, radioText, radioValue);
        if (newRadioElement)
          radioElementParent?.append(newRadioElement);
        if (key === array.length - 1) {
          let lastRadioElement;
          if (radioType === "Lawyer") {
            lastRadioElement = createRadioElement(
              radioElementTemplate,
              "No - please fill in purchaser solicitors section below",
              "Custom Lawyer"
            );
          } else {
            lastRadioElement = createRadioElement(
              radioElementTemplate,
              "No - please fill in purchaser broker section below",
              "Custom Broker"
            );
          }
          if (lastRadioElement)
            radioElementParent?.append(lastRadioElement);
          const firstRadio = radioElementParent?.querySelector(".w-form-formradioinput:first-child");
          if (firstRadio)
            firstRadio.checked = true;
        }
      }
    });
  };
  var lawyerDataElement = document.querySelectorAll('[data-element="Lawyer Item"]');
  var lawyerRadioTemplate = document.querySelector(
    '[data-element="Lawyer Radio"]'
  );
  if (lawyerRadioTemplate)
    renderRadio(lawyerDataElement, lawyerRadioTemplate, "Lawyer");
  var brokerDataElement = document.querySelectorAll('[data-element="Broker Item"]');
  var brokerRadioTemplate = document.querySelector(
    '[data-element="Broker Radio"]'
  );
  if (brokerRadioTemplate)
    renderRadio(brokerDataElement, brokerRadioTemplate, "Broker");
  document.addEventListener("click", function(e) {
    const targetElement = e.target;
    if (targetElement.classList.contains("lawyer-radio")) {
      if (targetElement.value === "Custom Lawyer") {
        document.querySelector('[data-element="Custom Lawyer"]')?.classList.remove("hide");
      } else {
        document.querySelector('[data-element="Custom Lawyer"]')?.classList.add("hide");
      }
    }
    if (targetElement.classList.contains("broker-radio")) {
      if (targetElement.value === "Custom Broker") {
        document.querySelector('[data-element="Custom Broker"]')?.classList.remove("hide");
      } else {
        document.querySelector('[data-element="Custom Broker"]')?.classList.add("hide");
      }
    }
  });
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function naturalCompare(a, b) {
    const ax = [], bx = [];
    a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
      ax.push([$1 || Infinity, $2 || ""]);
    });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
      bx.push([$1 || Infinity, $2 || ""]);
    });
    while (ax.length && bx.length) {
      const an = ax.shift();
      const bn = bx.shift();
      const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
      if (nn)
        return nn;
    }
    return ax.length - bx.length;
  }
  $(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    });
    const { address } = params;
    const { at } = params;
    const { atv } = params;
    const inputAddress = document.querySelector('[data-element="Listing"]');
    inputAddress.value = address;
    if (at) {
      getPropertyData(at, atv).then((data) => processData(data));
    }
  });
  function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
})();
//# sourceMappingURL=request-a-contract.js.map

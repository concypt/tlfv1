"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`http://localhost:${3e3}/esbuild`).addEventListener(
    "change",
    () => location.reload()
  );

  // src/listings.ts
  var memberstack = window.$memberstackDom;
  var thisListing = window.location.href.split("/").pop();
  var thisListingFinal = thisListing?.split("?")[0];
  memberstack.getCurrentMember().then(({ data: member }) => {
    if (!member) {
      protectPage();
    }
  });
  var protectPage = () => {
    let redirect = true;
    const reffererName = document.referrer.split("/").pop();
    const reffererNameFinal = reffererName?.split("?")[0];
    const reffererCollectionItems = document.querySelectorAll('[data-element="refferer-item"]');
    if (!reffererCollectionItems)
      return;
    reffererCollectionItems.forEach((value) => {
      const name = value.querySelector('[data-element="refferer-name"]')?.textContent;
      const listing = value.querySelector('[data-element="refferer-listing"]')?.textContent;
      if (name === reffererNameFinal && listing === thisListingFinal) {
        redirect = false;
      }
    });
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params) {
      const elementName = document.querySelector('[data-element="contact-agent-name"]');
      if (!elementName)
        return;
      elementName.textContent = params.name;
      const elementPhone = document.querySelector('[data-element="contact-agent-phone"]');
      if (!elementPhone)
        return;
      elementPhone.textContent = params.phone;
      elementPhone.closest("a").href = "tel:" + params.phone;
      const elementEmail = document.querySelector('[data-element="contact-agent-email"]');
      if (!elementEmail)
        return;
      elementEmail.textContent = params.email;
      elementEmail.closest("a").href = "mailto:" + params.email;
      const elementAgency = document.querySelector('[data-element="contact-agent-agency"]');
      if (!elementAgency)
        return;
      elementAgency.textContent = params.agency;
      const elementNameM = document.querySelector('[data-element="m-contact-agent-name"]');
      if (!elementNameM)
        return;
      elementNameM.textContent = params.name;
      const elementPhoneM = document.querySelector('[data-element="m-contact-agent-phone"]');
      if (!elementPhoneM)
        return;
      elementPhoneM.textContent = params.phone;
      elementPhoneM.closest("a").href = "tel:" + params.phone;
      const elementEmailM = document.querySelector('[data-element="m-contact-agent-email"]');
      if (!elementEmailM)
        return;
      elementEmailM.textContent = params.email;
      elementEmailM.closest("a").href = "mailto:" + params.email;
      const elementAgencyM = document.querySelector('[data-element="m-contact-agent-agency"]');
      if (!elementAgencyM)
        return;
      elementAgencyM.textContent = params.agency;
    }
    if (redirect)
      window.location.href = "/login";
  };
  $(() => {
    memberstack.getCurrentMember().then(({ data: member }) => {
      if (member) {
        const memberName = member.customFields["first-name"] + " " + member.customFields["last-name"];
        const memberPhone = member.customFields.mobile;
        const memberEmail = member.auth.email;
        const memberAgency = member.customFields["agency-name"];
        const memberQueryParameters = "?name=" + memberName + "&phone=" + memberPhone + "&email=" + memberEmail + "&agency=" + memberAgency;
        const shareSlug = createString(21);
        const newURL = "https://" + window.location.hostname + "/fdiautvtnzxynmp/" + shareSlug + "/" + memberQueryParameters;
        const inputURL = document.querySelector("#input-url");
        const inputShareSlug = document.querySelector("#input-share-slug");
        const inputListing = document.querySelector("#input-listing");
        const inputFakeListing = document.querySelector('[data-element="fake-text"]');
        if (inputURL)
          inputURL.value = newURL;
        if (inputShareSlug)
          inputShareSlug.value = shareSlug;
        if (inputListing && thisListing)
          inputListing.value = thisListing;
        if (inputFakeListing)
          inputFakeListing.innerHTML = newURL;
        const btnCopyURL = document.querySelector("#btn-copy-url");
        btnCopyURL?.addEventListener("click", function(event) {
          copyTextToClipboard(newURL);
        });
        const btnCopyURLFake = document.querySelector('[data-element="btn-fake-share-url"]');
        btnCopyURLFake?.addEventListener("click", function(event) {
          copyTextToClipboard(newURL);
        });
      }
    });
    const scheduleViewing = document.querySelector('[data-element="btn-schedule-viewing"]')?.getAttribute("href");
    if (scheduleViewing === "https://www.thelistingsfactory.co.nz/schedule-viewing") {
      const listingAddress = document.querySelector(
        '[data-element="address"]'
      )?.textContent;
      const newHref = scheduleViewing + "?address=" + listingAddress;
      document.querySelector('[data-element="btn-schedule-viewing"]')?.setAttribute("href", newHref);
    }
  });
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
    runNotificationAnim('[data-element="wait-notification"]', '[data-element="copied-notification"]');
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function() {
        runNotificationAnim(
          '[data-element="wait-notification"]',
          '[data-element="copied-notification"]'
        );
      },
      function(err) {
        console.log(err);
      }
    );
  }
  function runNotificationAnim(selectorWait, selectorCopied) {
    const waitText = document.querySelector(selectorWait);
    const copiedText = document.querySelector(selectorCopied);
    if (waitText)
      waitText.style.display = "block";
    setTimeout(() => {
      if (waitText)
        waitText.style.display = "none";
      if (copiedText)
        copiedText.style.display = "block";
      setTimeout(() => {
        if (copiedText)
          copiedText.style.display = "none";
      }, 1e3);
    }, 3e3);
  }
  function createString(length) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async function getPropertyData(tableName2, tableViewName2) {
    let tableURL;
    tableName2 = htmlDecode(tableName2) || "";
    if (tableViewName2) {
      tableViewName2 = htmlDecode(tableViewName2) || "";
      tableURL = "https://api.airtable.com/v0/appWNf6XfqAR6n0oT/" + encodeURIComponent(tableName2) + "?api_key=keyUxdcC40qxNrt1Y&&view=" + encodeURIComponent(tableViewName2).replace(/%20/g, "+");
    } else {
      tableURL = "https://api.airtable.com/v0/appWNf6XfqAR6n0oT/" + encodeURIComponent(tableName2) + "?api_key=keyUxdcC40qxNrt1Y&";
    }
    const response = await fetch(tableURL);
    const responseJson = await response.json();
    return responseJson;
  }
  if (!tableName) {
    document.querySelector('[data-element="sl-table-wrapper"]')?.remove();
    document.querySelector('[data-element="sl-title"]').textContent = "Stocklist not found";
  } else {
    getPropertyData(tableName, tableViewName).then((data) => processData(data));
  }
  var processData = (data) => {
    if (data.error) {
      document.querySelector('[data-element="sl-table-wrapper"]')?.remove();
      document.querySelector('[data-element="sl-title"]').textContent = "Stocklist not found";
      return;
    }
    const dataRecords = data["records"];
    dataRecords.forEach((obj) => {
      const isnum = /^\d+$/.test(obj.fields["Unit/Lot"]);
      if (isnum)
        obj.fields["Unit/Lot"] = parseInt(obj.fields["Unit/Lot"]);
      if (obj.fields.Price)
        obj.fields.Price = "$" + numberWithCommas(obj.fields.Price);
    });
    const dataFirstRow = dataRecords[0].fields;
    const foundHeaders = Object.keys(dataFirstRow);
    const defaultColHeaders = ["Unit/Lot", "Price", "Beds", "Baths", "Car Park", "Internal"];
    const colHeaders = defaultColHeaders.filter((x) => foundHeaders.indexOf(x) > -1);
    const difference = foundHeaders.filter((x) => colHeaders.indexOf(x) === -1);
    difference.push(difference.splice(difference.indexOf("Status"), 1)[0]);
    difference.forEach((item) => {
      if (item !== "Discount")
        colHeaders.push(item);
    });
    const tableHeaderRow = document.querySelector('[data-element="table-row"]');
    const tableHeaderCell = tableHeaderRow?.firstChild;
    if (tableHeaderRow?.innerHTML)
      tableHeaderRow.innerHTML = "";
    let styleString = "grid-template-columns: ";
    colHeaders.forEach((value) => {
      const newColHeader = tableHeaderCell?.cloneNode(true);
      newColHeader.textContent = value;
      newColHeader.setAttribute("data-sortelement", value);
      tableHeaderRow?.append(newColHeader);
      styleString = styleString + "1fr ";
    });
    document.querySelectorAll(".s-table-row-inner").forEach((value) => {
      value.setAttribute("style", styleString);
    });
    const rowElementTemplate = document.querySelector(
      '[data-element="stocklist-row"]'
    );
    if (!rowElementTemplate)
      return;
    const rowParentElement = rowElementTemplate?.parentElement;
    if (!rowParentElement)
      return;
    renderTable(dataRecords, rowElementTemplate, rowParentElement, "Unit/Lot", "asc", colHeaders);
    const tableHeaders = document.querySelectorAll(".s-table-head-item");
    tableHeaders.forEach((node) => {
      node.addEventListener("click", (e) => {
        e.preventDefault();
        if (!node.classList.contains("selected")) {
          document.querySelector(".selected")?.classList.remove("asc");
          document.querySelector(".selected")?.classList.remove("desc");
          document.querySelector(".selected")?.classList.remove("selected");
        }
        if (node.classList.contains("desc") && !node.classList.contains("first")) {
          renderTable(
            dataRecords,
            rowElementTemplate,
            rowParentElement,
            node.dataset.sortelement,
            "asc",
            colHeaders
          );
          node.classList.add("selected", "asc");
          node.classList.remove("desc");
        } else {
          renderTable(
            dataRecords,
            rowElementTemplate,
            rowParentElement,
            node.dataset.sortelement,
            "desc",
            colHeaders
          );
          if (!node.classList.contains("first")) {
            node.classList.add("selected", "desc");
            node.classList.remove("asc");
          }
        }
      });
    });
  };
  var renderTable = (dataRecords, rowElementTemplate, rowParentElement, sortByField, sortOrder, colHeaders) => {
    rowParentElement.innerHTML = "";
    let even = false;
    const sortedDataRecords = sortData(dataRecords, sortByField, sortOrder);
    for (const key in sortedDataRecords) {
      if (sortedDataRecords.hasOwnProperty(key)) {
        const dataRecord = sortedDataRecords[key]["fields"];
        const newRow = createRow(rowElementTemplate, dataRecord, colHeaders);
        if (!newRow)
          return;
        if (even)
          newRow.classList.add("colored");
        even = !even;
        rowParentElement.append(newRow);
      }
    }
  };
  var createRow = (rowTemplate, rowData, colHeaders) => {
    const newItem = rowTemplate.cloneNode(true);
    const tableCell = newItem.querySelector(".s-table-cell-item");
    const tableCellContainer = tableCell?.parentElement;
    if (!tableCellContainer)
      return;
    if (!tableCell)
      return;
    tableCellContainer.innerHTML = "";
    newItem.innerHTML = "";
    colHeaders.forEach((value) => {
      const newTableCell = tableCell.cloneNode(true);
      newTableCell.setAttribute("data-element", value);
      newTableCell.textContent = rowData[value];
      if (value === "Internal" || value === "External" || value === "Land Size" || value === "Land" || value === "Lot Size") {
        newTableCell.innerHTML = Math.floor(rowData[value]) + "m <sup>2</sup>";
      }
      if (value === "Status") {
        if (rowData[value] === "Sold") {
          newTableCell.classList.add("status-red");
        } else if (rowData[value] === "Under Contract") {
          newTableCell.classList.add("status-orange");
        } else if (rowData[value] === "Available") {
          newTableCell.classList.add("status-green");
        }
      }
      tableCellContainer.append(newTableCell);
    });
    newItem.append(tableCellContainer);
    return newItem;
  };
  var sortData = (data, sortByField, sortOrder) => {
    if (sortByField === "Default") {
      return data;
    }
    const sortType = typeof data[0].fields[sortByField];
    if (!sortType)
      return;
    const sortedData = data.slice(0);
    if (sortType === "number") {
      sortedData.sort(function(a, b) {
        let rValue;
        if (sortOrder === "desc") {
          rValue = b.fields[sortByField] - a.fields[sortByField];
        } else if (sortOrder === "asc") {
          rValue = a.fields[sortByField] - b.fields[sortByField];
        }
        return rValue;
      });
    } else if (sortType === "string" || sortType === "Default") {
      const sortAlphaNum = (a, b) => {
        const x = a.fields[sortByField].toLowerCase();
        const y = b.fields[sortByField].toLowerCase();
        let rValue;
        if (sortOrder === "desc") {
          rValue = y.localeCompare(x, "en", { numeric: true });
        } else if (sortOrder === "asc") {
          rValue = x.localeCompare(y, "en", { numeric: true });
        }
        return rValue;
      };
      sortedData.sort(sortAlphaNum);
    }
    return sortedData;
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  function requestForContract() {
    const propertyAddress = document.querySelector('[data-element="address"]')?.textContent;
    if (!propertyAddress)
      return;
    const baseURL = "/request-for-contract?address=" + encodeURIComponent(propertyAddress) + "&at=" + encodeURIComponent(tableName) + "&atv=" + encodeURIComponent(tableViewName);
    window.open(baseURL, "_blank");
  }
  document.querySelector("#btn-request-a-contract")?.addEventListener("click", (e) => {
    e.preventDefault();
    requestForContract();
  });
  document.querySelector("#btn-request-a-contract-m")?.addEventListener("click", (e) => {
    e.preventDefault();
    requestForContract();
  });
})();
//# sourceMappingURL=listings.js.map

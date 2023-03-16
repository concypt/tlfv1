"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`http://localhost:${3e3}/esbuild`).addEventListener(
    "change",
    () => location.reload()
  );

  // src/properties.ts
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsload",
    async (listInstances) => {
      const [listInstance] = listInstances;
      window.fsAttributes.push([
        "cmsfilter",
        (filterInstances) => {
          const [filterInstance] = filterInstances;
          if (!filterInstance)
            return;
          if (!listInstance)
            return;
          const completionFilterCriterias = getFilterCriteria(listInstance, "Completion");
          if (!completionFilterCriterias)
            return;
          const filtersDropdownTemplateElement = filterInstance.form.querySelector(
            '[data-element="completion"]'
          );
          if (!filtersDropdownTemplateElement)
            return;
          populateOptions(filtersDropdownTemplateElement, completionFilterCriterias);
          const priceFilterCriterias = [];
          for (let i = 4e5; i <= 15e5; i = i + 1e5) {
            priceFilterCriterias.push(i.toString());
          }
          if (!priceFilterCriterias)
            return;
          const priceMinDropdownTemplateElement = filterInstance.form.querySelector(
            '[data-element="price-dropdown-min"]'
          );
          if (!priceMinDropdownTemplateElement)
            return;
          const priceMaxDropdownTemplateElement = filterInstance.form.querySelector(
            '[data-element="price-dropdown-max"]'
          );
          if (!priceMaxDropdownTemplateElement)
            return;
          populateOptions(priceMinDropdownTemplateElement, priceFilterCriterias);
          populateOptions(priceMaxDropdownTemplateElement, priceFilterCriterias);
          const bedsCheckBoxOptions = getChecksCriteria(
            listInstance,
            "criteria-beds",
            "min-beds",
            "max-beds"
          );
          if (!bedsCheckBoxOptions)
            return;
          const bathsCheckBoxOptions = getChecksCriteria(
            listInstance,
            "criteria-baths",
            "min-baths",
            "max-baths"
          );
          if (!bathsCheckBoxOptions)
            return;
          const bedsFilterTemplateElement = filterInstance.form.querySelector(
            '[data-element="beds-filter"]'
          );
          if (!bedsFilterTemplateElement)
            return;
          const bathsFilterTemplateElement = filterInstance.form.querySelector(
            '[data-element="baths-filter"]'
          );
          if (!bathsFilterTemplateElement)
            return;
          const bedsFilterParent = bedsFilterTemplateElement.parentElement;
          if (!bedsFilterParent)
            return;
          const bathsFilterParent = bathsFilterTemplateElement.parentElement;
          if (!bathsFilterParent)
            return;
          bedsFilterTemplateElement.remove();
          bathsFilterTemplateElement.remove();
          for (const bedsCheckBoxOption of bedsCheckBoxOptions) {
            const bedsFilter = createCheckboxesFilter(bedsCheckBoxOption, bedsFilterTemplateElement);
            if (!bedsFilter)
              continue;
            bedsFilterParent.append(bedsFilter);
          }
          for (const bathsCheckBoxOption of bathsCheckBoxOptions) {
            const bathsFilter = createCheckboxesFilter(
              bathsCheckBoxOption,
              bathsFilterTemplateElement
            );
            if (!bathsFilter)
              continue;
            bathsFilterParent.append(bathsFilter);
          }
          const newListItems = listInstance.items.map((item) => item.element);
          listInstance.clearItems();
          listInstance.addItems(newListItems);
          filterInstance.storeFiltersData();
          const minPriceSelect = document.querySelector("#min-price");
          if (!minPriceSelect)
            return;
          const maxPriceSelect = document.querySelector("#max-price");
          if (!maxPriceSelect)
            return;
          minPriceSelect.addEventListener("change", (event) => {
            const eventTarget = event.target.value;
            if (!eventTarget)
              return;
            document.querySelectorAll("#max-price option").forEach((opt) => {
              opt.style.display = "block";
            });
            document.querySelectorAll("#max-price option").forEach((opt) => {
              if (Number(opt.value) <= Number(eventTarget)) {
                opt.style.display = "none";
              }
            });
            filterPrice();
          });
          maxPriceSelect.addEventListener("change", (event) => {
            const eventTarget = event.target.value;
            if (!eventTarget)
              return;
            document.querySelectorAll("#min-price option").forEach((opt) => {
              opt.style.display = "block";
            });
            document.querySelectorAll("#min-price option").forEach((opt) => {
              if (Number(opt.value) >= Number(eventTarget)) {
                opt.style.display = "none";
              }
            });
            filterPrice();
          });
          const filterPrice = () => {
            listInstance.clearItems();
            listInstance.addItems(newListItems);
            const changedListItems = applyPriceFilter(listInstance);
            if (!changedListItems)
              return;
            listInstance.clearItems();
            listInstance.addItems(changedListItems);
          };
          document.addEventListener("click", (ev) => {
            const clickedElement = ev.target;
            if (!clickedElement)
              return;
            if (clickedElement.classList.contains("checkbox-select-wrapper")) {
              showRadioOptions(clickedElement);
            } else if (clickedElement.classList.contains("checkbox-select-text")) {
              showRadioOptions(clickedElement.parentElement);
            } else {
              hideRadioOptions();
            }
          });
          document.querySelectorAll(".button-secondary.pagination").forEach((item) => {
            item.addEventListener("click", () => {
              window.scrollTo({ top: 500, behavior: "smooth" });
            });
          });
        }
      ]);
    }
  ]);
  var applyPriceFilter = (listInstance) => {
    let minRange = Number(
      document.querySelector("#min-price")?.value.replace(/,/g, "")
    );
    if (!minRange)
      return;
    minRange = minRange - 26e3;
    const maxRange = Number(
      document.querySelector("#max-price")?.value.replace(/,/g, "")
    );
    if (!maxRange)
      return;
    const newListItems = listInstance.items.filter((item) => {
      const itemMinPrice = Number(
        item.element.querySelector('[data-element="min-price"]')?.innerText.replace(/,/g, "")
      );
      if (!itemMinPrice)
        return;
      const itemMaxPrice = Number(
        item.element.querySelector('[data-element="max-price"]')?.innerText.replace(/,/g, "")
      );
      let isRange = false;
      if (itemMaxPrice) {
        if (itemMaxPrice >= minRange && itemMaxPrice <= maxRange) {
          isRange = true;
        } else {
          if (itemMinPrice >= minRange && itemMinPrice <= maxRange) {
            isRange = true;
          }
        }
      } else {
        if (itemMinPrice >= minRange && itemMinPrice <= maxRange) {
          isRange = true;
        }
      }
      return isRange;
    });
    return newListItems.map((item) => item.element);
  };
  var createFilter = (selectOption, templateElement) => {
    const newFilter = templateElement.cloneNode(true);
    newFilter.value = selectOption;
    if (selectOption.charAt(0) >= "0" && selectOption.charAt(0) <= "9") {
      selectOption = "$" + numberWithCommas(selectOption);
    }
    newFilter.textContent = selectOption;
    return newFilter;
  };
  var getFilterCriteria = (listInstance, filterValueSelector) => {
    const newFilterCriteria = [];
    const listInstanceItems = listInstance.items;
    if (!listInstance)
      return;
    for (const listInstanceItem of listInstanceItems) {
      const innerElement = listInstanceItem.element.querySelector(
        '[fs-cmsfilter-field="' + filterValueSelector + '"]'
      );
      if (!innerElement?.innerText)
        continue;
      newFilterCriteria.push(innerElement.innerText);
    }
    if (!newFilterCriteria)
      return;
    return newFilterCriteria;
  };
  var populateOptions = (dropDownElement, dropDownOptions) => {
    const filtersOptionTemplateElement = dropDownElement.options[0];
    if (!filtersOptionTemplateElement)
      return;
    const optionsLength = dropDownElement.options.length - 1;
    let i;
    for (i = optionsLength; i >= 1; i--) {
      dropDownElement.remove(i);
    }
    const finalDropDownOptions = [];
    dropDownOptions.forEach((string) => {
      !finalDropDownOptions.includes(string) && finalDropDownOptions.push(string);
    });
    const firstChar = Array.from(dropDownOptions[0])[0];
    if (firstChar === "C" || firstChar === "Q") {
      const indexOfCompleted = finalDropDownOptions.indexOf("Completed");
      if (indexOfCompleted > -1) {
        finalDropDownOptions.splice(indexOfCompleted, 1);
      }
      finalDropDownOptions.sort((a, b) => b.slice(3) - a.slice(3) || b[1].localeCompare(a[1]));
      finalDropDownOptions.unshift("Completed");
    }
    for (const dropDownOption of finalDropDownOptions) {
      const newFilter = createFilter(dropDownOption, filtersOptionTemplateElement);
      if (!newFilter)
        continue;
      dropDownElement.append(newFilter);
    }
  };
  var getChecksCriteria = (listInstance, filterValueSelector, filterMinSelector, filterMaxSelector) => {
    const listInstanceItems = listInstance.items;
    let rangeUnique = [];
    if (!listInstance)
      return;
    for (const listInstanceItem of listInstanceItems) {
      const minValue = listInstanceItem.element.querySelector(
        '[data-element="' + filterMinSelector + '"]'
      );
      if (!minValue)
        return;
      const minInt = parseInt(minValue.innerText);
      const maxValue = listInstanceItem.element.querySelector(
        '[data-element="' + filterMaxSelector + '"]'
      );
      if (!maxValue)
        return;
      const maxInt = parseInt(maxValue.innerText);
      let range = [];
      if (maxInt) {
        range = Array.from({ length: maxInt - minInt + 1 }, (_, i) => minInt + i);
        rangeUnique.push(...range);
      } else {
        range.push(minInt);
        rangeUnique.push(...range);
      }
      const criteriaDivElement = listInstanceItem.element.querySelector(
        '[data-element="' + filterValueSelector + '"]'
      );
      if (!criteriaDivElement)
        return;
      const filterDivParentElement = criteriaDivElement.parentElement;
      if (!filterDivParentElement)
        return;
      criteriaDivElement.remove();
      for (const option of range) {
        const newCriteriaDiv = createFilterCriteriaDiv(option, criteriaDivElement);
        if (!newCriteriaDiv)
          continue;
        filterDivParentElement.append(newCriteriaDiv);
      }
    }
    rangeUnique = rangeUnique.filter((v, i, a) => a.indexOf(v) === i);
    rangeUnique = rangeUnique.sort(function(a, b) {
      return a - b;
    });
    if (!rangeUnique)
      return;
    return rangeUnique;
  };
  var createFilterCriteriaDiv = (option, templateElement) => {
    const newFilterCriteriaDiv = templateElement.cloneNode(true);
    newFilterCriteriaDiv.textContent = option.toString();
    return newFilterCriteriaDiv;
  };
  var createCheckboxesFilter = (option, templateElement) => {
    const newCheckbox = templateElement.cloneNode(true);
    const label = newCheckbox.querySelector("span");
    const check = newCheckbox.querySelector("input");
    if (!label || !check)
      return;
    label.textContent = option.toString();
    check.value = option.toString();
    return newCheckbox;
  };
  var showRadioOptions = (element) => {
    const { parentElement } = element;
    const optionsElement = parentElement?.querySelector(
      '[data-element="radio-options"]'
    );
    if (optionsElement.classList.contains("hide")) {
      optionsElement.classList.remove("hide");
      element.classList.add("enabled");
    } else {
      hideRadioOptions();
    }
  };
  var hideRadioOptions = () => {
    document.querySelectorAll('[data-element="radio-options"]').forEach((value) => {
      value.classList.add("hide");
    });
    document.querySelectorAll(".checkbox-select-wrapper").forEach((value) => {
      value.classList.remove("enabled");
    });
    updateRadioSelectText();
  };
  var updateRadioSelectText = async () => {
    await delay(100);
    const radioSelectWrapper = document.querySelectorAll('[data-element="radio-select-wrapper"]');
    if (!radioSelectWrapper)
      return;
    radioSelectWrapper.forEach((radioSelectWrapper2) => {
      const radioSelectText = radioSelectWrapper2.querySelector('[data-element="radio-select-text"]');
      if (!radioSelectText)
        return;
      const radioSelectCaption = radioSelectWrapper2.querySelector(".im-label strong")?.textContent;
      if (!radioSelectCaption)
        return;
      const radioDefaultText = "Any " + radioSelectCaption;
      let thisEnabledOptions = "";
      radioSelectWrapper2.querySelectorAll(".fs-cmsfilter_active").forEach((activeRadio) => {
        thisEnabledOptions += activeRadio.querySelector(".w-form-label")?.textContent;
        thisEnabledOptions += ", ";
      });
      thisEnabledOptions = thisEnabledOptions.trim();
      const optionsLength = thisEnabledOptions.length;
      if (optionsLength > 0) {
        radioSelectText.textContent = thisEnabledOptions.substring(0, optionsLength - 1);
      } else {
        radioSelectText.textContent = radioDefaultText;
      }
    });
  };
  var delay = (ms) => new Promise((res) => setTimeout(res, ms));
  var numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
})();
//# sourceMappingURL=properties.js.map

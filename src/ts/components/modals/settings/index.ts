import * as bootstrap from "bootstrap";
import Picker from "vanilla-picker";
import { ConstantApplication } from "../../../constants/application";
import store from "../../../redux";
import { actions, getSettings } from "../../../redux/reducers/user-settings";
import { StoreLogger } from "../../../logger";
import { SettingsTable } from "../../../types/settings-table";
import { BaseModal } from "../base-modal";
import template from "./template.html";

export class Settings extends BaseModal {
  constructor() {
    super();
  }

  async connectedCallback() {
    BaseModal.prototype.init.call(this, ["Settings"]);

    this.page1();

    this.formListeners();
  }

  page1() {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(template, `text/html`);
    if (htmlDoc.querySelector(`[template]`)) {
      const selector = htmlDoc.querySelector(`[template]`);
      if (selector) {
        const node = document.importNode(selector, true);
        node.removeAttribute(`template`);
        const carousel = this.querySelector(`[carousel-items]`);
        carousel?.append(node);
        this.colorPickerSetup();
        this.inputSetup();
        storeLogger.info("Settings Modal rendered");
      }
    } else {
      storeLogger.error("Settings Modal NOT rendered");
    }
  }

  colorPickerSetup() {
    const settings: SettingsTable = getSettings() as SettingsTable;
    const allPickers = [
      {
        id: `#tagged-data`,
        name: `Tagged Data`,
        color: settings?.[`#tagged-data`],
        reset: `#FF6600FF`,
        alpha: false,
      },
      {
        id: `#nested-fact-parent`,
        name: `Nested Fact Parent`,
        color: settings?.[`#nested-fact-parent`],
        reset: `#FF6600FF`,
        alpha: false,
      },
      {
        id: `#search-results`,
        name: `Search Results`,
        color: settings?.[`#search-results`],
        reset: `#FFD700FF`,
        alpha: false,
      },
      {
        id: `#selected-fact`,
        name: `Selected Fact`,
        color: settings?.[`#selected-fact`],
        reset: `#003768FF`,
        alpha: false,
      },
      {
        id: `#tag-shading`,
        name: `Tag Shading`,
        color: settings?.[`#tag-shading`],
        reset: `#ff00004d`,
        alpha: true,
      },
    ];

    allPickers.forEach((current) => {
      const picker = new Picker({
        parent: this.querySelector(current.id) as HTMLElement,
        popup: false,
        alpha: current.alpha,
        editor: false,
        color: current.color,
        cancelButton: false,
        onChange: (color) => {
          if (color.hex.toLowerCase() !== current.color.toLowerCase()) {
            const updatedSettings = { ...settings };
            updatedSettings[current.id] = color.hex;
            store.dispatch(actions.settingsUpdate(updatedSettings));
            this.toast(`${current.name} color has been saved.`);
          }
        },
        onDone: () => {
          picker.setColor(current.reset, true);
          const updatedSettings = { ...settings };
          updatedSettings[current.id] = current.reset;
          store.dispatch(actions.settingsUpdate(updatedSettings));
          this.toast(`${current.name} color has been reset.`);
        },
      });
      (
        this.querySelector(`${current.id} .picker_done button`) as HTMLElement
      ).innerText = `Reset`;
    });
  }

  inputSetup() {
    const settings: SettingsTable = getSettings() as SettingsTable;
    (
      this.querySelector(`[name="allFacts"]`) as HTMLSelectElement
    ).value = `${settings.allFacts}`;

    (
      this.querySelector(`[name="hoverInfo"]`) as HTMLSelectElement
    ).value = `${settings.hoverInfo}`;

    (
      this.querySelector(`[name="position"]`) as HTMLSelectElement
    ).value = `${settings.position}`;
  }

  formListeners() {
    const settings: SettingsTable = getSettings() as SettingsTable;
    const selectInputs = Array.from(
      this.querySelectorAll(
        `[name="allFacts"],[name="hoverInfo"],[name="position"]`
      ) as unknown as HTMLSelectElement
    );
    const updatedSettings = { ...settings };
    selectInputs.forEach((current) => {
      current.addEventListener(`change`, (event) => {
        if (current.getAttribute(`name`) === `allFacts`) {
          ConstantApplication.disableApplication();
          const moreFilters = document.querySelector(`sec-more-filters`);
          moreFilters?.setAttribute(`empty`, `true`);
          // const storeFilter: StoreFilter = StoreFilter.getInstance();
          // storeFilter.filterFacts();
          ConstantApplication.enableApplication();
        }
        updatedSettings[current.getAttribute(`name`) as string] = (
          event.target as HTMLSelectElement
        ).value;
        Object.keys(updatedSettings).forEach((current) => {
          if (updatedSettings[current] === `true`) {
            updatedSettings[current] = true;
          } else if (updatedSettings[current] === `false`) {
            updatedSettings[current] = false;
          }
        });
        store.dispatch(actions.settingsUpdate(updatedSettings));
        this.toast(
          `${current.getAttribute(`aria-label`)} option has been saved.`
        );
      });
    });
  }

  // updateAllFacts(input: number) {
  //   console.log(input);
  //   ConstantApplication.disableApplication();
  //   this.toast(`Show All Facts Setting Updated`);
  //   const moreFilters = document.querySelector(`sec-more-filters`);
  //   moreFilters?.setAttribute(`empty`, `true`);
  //   const storeFilter: StoreFilter = StoreFilter.getInstance();
  //   storeFilter.filterFacts();
  //   ConstantApplication.enableApplication();
  // }

  toast(input: string) {
    const storeLogger: StoreLogger = StoreLogger.getInstance();
    const content = this.querySelector(`[toast-content]`);
    if (content) {
      const span = document.createElement(`span`);
      const text = document.createTextNode(input);
      span.append(text);
      content.firstElementChild?.replaceWith(span);
      const toast = new bootstrap.Toast(
        this.querySelector("#liveToast") as Element
      );
      toast.show();
      storeLogger.info("Settings Modal Toast rendered");
    } else {
      storeLogger.error("Settings Modal NOT rendered");
    }
  }
}

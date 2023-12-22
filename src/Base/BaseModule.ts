import { BaseSettingsModel } from "../Models/Base";
import { SettingsModel } from "../Models/Settings";
import { Subscreen } from "./SettingDefinitions";

export abstract class BaseModule {
  get settingsScreen(): Subscreen | null {
    return null;
  }

  /** Allows changing the subkey for that module settings storage */
  get settingsStorage(): string | null {
    return this.constructor.name;
  }

  get settings(): BaseSettingsModel {
    if (!this.settingsStorage) return {} as BaseSettingsModel;
    if (!Player.BCResponsive) {
      Player.BCResponsive = <SettingsModel>{};
      this.registerDefaultSettings();
    } else if (!(<any>Player.BCResponsive)[this.settingsStorage]) this.registerDefaultSettings();
    return (<any>Player.BCResponsive)[this.settingsStorage];
  }

  get enabled(): boolean {
    if (!Player?.BCResponsive?.GlobalModule) return false;
    return (
      Player.BCResponsive.GlobalModule.ResponsiveEnabled &&
      this.settings.ResponsiveEnabled &&
      (ServerPlayerIsInChatRoom() || (CurrentModule == "Room" && CurrentScreen == "Crafting"))
    );
  }

  Init() {
    this.registerDefaultSettings();
  }

  registerDefaultSettings(): void {
    const storage = this.settingsStorage;
    const defaults = this.defaultSettings;
    if (!storage || !defaults) return;

    (<any>Player.BCResponsive)[storage] = Object.assign(defaults, (<any>Player.BCResponsive)[storage] ?? {});
  }

  get defaultSettings(): BaseSettingsModel | null {
    return null;
  }

  Load() {}

  Run() {
    // Empty
  }

  Unload() {
    // Empty
  }
}

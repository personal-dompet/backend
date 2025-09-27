import 'dayjs/locale/en'
import 'dayjs/locale/id'
import dayjs, { Dayjs } from 'dayjs';

type DayjsLocale = 'en' | 'id'

export class AppDate {
  public date!: Dayjs;
  private locale: DayjsLocale = 'id';

  constructor(data?: {
    date?: dayjs.ConfigType,
    locale?: DayjsLocale
  }) {
    this.date = dayjs(data?.date)
    if (data?.locale) {
      this.locale = data.locale
    }
  }

  unix() {
    return this.date.unix();
  }

  /**
   * @param template string
   * @description See all available tempplates on -> https://day.js.org/docs/en/display/format#list-of-all-available-formats
   * @returns 
   */
  format(template?: string): string {
    return this.date.locale(this.locale).format(template)
  }

  /**
   * @param count number
   * @param unit dayjs.ManipulateType
   * @description See all available units on -> https://day.js.org/docs/en/manipulate/add#list-of-all-available-units
   * @returns 
   */
  add(count: number, unit?: dayjs.ManipulateType) {
    this.date = this.date.add(count, unit)
    return this;
  }
}
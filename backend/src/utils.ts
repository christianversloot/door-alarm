export default class Utils {

  /**
   * Get name of a class through constructor.
   */
  static getClassName(constructor: Function): string {
    return constructor.toString().match(/\w+/g)[1];
  }

}
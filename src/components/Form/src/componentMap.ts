/*
 * @Author: jdm
 * @Date: 2024-10-28 16:48:07
 * @LastEditors: jdm
 * @LastEditTime: 2024-10-31 14:02:24
 * @FilePath: \vite-vue3-jdm\src\components\Form\src\componentMap.ts
 * @Description:
 *
 */
import {
  NCascader,
  NCheckbox,
  NDatePicker,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTimePicker,
} from 'naive-ui';
import type { Component } from 'vue';
import { ComponentType } from './types';

const componentMap = new Map<ComponentType | undefined, Component>();

componentMap.set('NInput', NInput);
componentMap.set('NInputNumber', NInputNumber);
componentMap.set('NSelect', NSelect);
componentMap.set('NSwitch', NSwitch);
componentMap.set('NCheckbox', NCheckbox);
componentMap.set('NDatePicker', NDatePicker);
componentMap.set('NTimePicker', NTimePicker);
componentMap.set('NCascader', NCascader);

export { componentMap };

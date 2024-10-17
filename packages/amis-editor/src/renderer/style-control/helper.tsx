import {getSchemaTpl} from 'amis-editor-core';

export const inputStateTpl = (
  className: string,
  token: string = '',
  options?: {
    state?: {
      label: string;
      value: string;
      token?: string;
    }[];
    hideFont?: boolean;
    hidePadding?: boolean;
    hideMargin?: boolean;
    hideRadius?: boolean;
    hideBackground?: boolean;
    hideBorder?: boolean;
  }
) => {
  const stateOptions = options?.state || [
    {
      label: '常规',
      value: 'default'
    },
    {
      label: '悬浮',
      value: 'hover'
    },
    {
      label: '选中',
      value: 'focused'
    },
    {
      label: '禁用',
      value: 'disabled'
    }
  ];

  const res: any = [
    {
      type: 'select',
      name: `__editorState${className}`,
      label: '状态',
      selectFirst: true,
      options: stateOptions
    },
    ...stateOptions.map((item: any) => {
      return {
        type: 'container',
        visibleOn:
          `\${__editorState${className} == '${item.value}'` +
          (item.value === 'default' ? ` || !__editorState${className}` : '') +
          `}`,
        body: inputStateFunc(
          item.value,
          className,
          item.token || token,
          options
        )
      };
    })
  ];
  return res;
};

export const inputStateFunc = (
  state: string,
  className: string,
  token: string,
  options: any
) => {
  const cssTokenState = state === 'focused' ? 'active' : state;

  if (token.includes('${state}')) {
    token = token.replace(/\${state}/g, cssTokenState);
  } else {
    token = `${token}-${cssTokenState}`;
  }
  return [
    !options?.hideFont &&
      getSchemaTpl('theme:font', {
        label: '文字',
        name: `${className}.font:${state}`,
        editorValueToken: token,
        state
      }),
    !options?.hideBackground &&
      getSchemaTpl('theme:colorPicker', {
        label: '背景',
        name: `${className}.background:${state}`,
        labelMode: 'input',
        needGradient: true,
        needImage: true,
        editorValueToken: `${token}-bg-color`,
        state
      }),
    !options?.hideBorder &&
      getSchemaTpl('theme:border', {
        name: `${className}.border:${state}`,
        editorValueToken: token,
        state
      }),
    !options?.hidePadding &&
      !options?.hideMargin &&
      getSchemaTpl('theme:paddingAndMargin', {
        name: `${className}.padding-and-margin:${state}`,
        editorValueToken: token,
        state,
        hidePadding: options?.hidePadding,
        hideMargin: options?.hideMargin
      }),
    !options?.hideRadius &&
      getSchemaTpl('theme:radius', {
        name: `${className}.radius:${state}`,
        editorValueToken: token,
        state
      }),
    ...(options?.schema || [])
  ].filter(Boolean);
};

export const buttonStateFunc = (visibleOn: string, state: string) => {
  return [
    getSchemaTpl('theme:font', {
      label: '文字',
      name: `themeCss.className.font:${state}`,
      visibleOn: visibleOn,
      editorValueToken: {
        'color': `--button-\${level || "default"}-${state}-font-color`,
        '*': '--button-size-${size || "default"}'
      },
      state
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `themeCss.className.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorValueToken: `--button-\${level || "default"}-${state}-bg-color`,
      state
    }),
    getSchemaTpl('theme:border', {
      name: `themeCss.className.border:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `--button-\${level || "default"}-${state}`,
      state
    }),
    getSchemaTpl('theme:paddingAndMargin', {
      name: `themeCss.className.padding-and-margin:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}',
      state
    }),
    getSchemaTpl('theme:radius', {
      name: `themeCss.className.radius:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}',
      state
    }),
    getSchemaTpl('theme:select', {
      label: '图标尺寸',
      name: `themeCss.iconClassName.iconSize:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}-icon-size',
      state
    })
  ];
};

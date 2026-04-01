export const treeData = [
  {
    label: '全院 (3院区)',
    value: 'all',
    children: [
      {
        label: '天河院区',
        value: 'tianhe',
        children: [
          { label: '心血管内科', value: 'xxgnk' },
          { label: '呼吸内科', value: 'hxnk' },
          { label: '消化内科', value: 'xhnk' },
        ]
      },
      {
        label: '珠玑院区',
        value: 'zhuji',
        children: [
          { label: '骨科', value: 'gk' },
          { label: '普外科', value: 'pwk' },
          { label: '泌尿外科', value: 'mnwk' },
        ]
      },
      {
        label: '同德院区',
        value: 'tongde',
        children: [
          { label: '妇产科', value: 'fck' },
          { label: '儿科', value: 'ek' },
          { label: '急诊科', value: 'jzk' },
        ]
      }
    ]
  }
];

export function getValidLabels(data: any[], val: string): string[] {
  let labels: string[] = [];
  
  const findNodeAndChildren = (items: any[], targetVal: string, isChild = false) => {
    for (const item of items) {
      if (item.value === targetVal || isChild) {
        labels.push(item.label);
        if (item.children) {
          findNodeAndChildren(item.children, targetVal, true);
        }
        if (!isChild) return true;
      } else if (item.children) {
        if (findNodeAndChildren(item.children, targetVal, false)) return true;
      }
    }
    return false;
  };
  
  findNodeAndChildren(data, val);
  return labels;
}

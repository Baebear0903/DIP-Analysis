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
          { label: '神经内科', value: 'sjnk' },
          { label: '血液内科', value: 'xynk' },
          { label: '肾内科', value: 'snk' },
          { label: '内分泌科', value: 'nfmk' },
          { label: '风湿免疫科', value: 'fsmyk' },
          { label: '感染内科', value: 'grnk' }
        ]
      },
      {
        label: '珠玑院区',
        value: 'zhuji',
        children: [
          { label: '骨科', value: 'gk' },
          { label: '普外科', value: 'pwk' },
          { label: '泌尿外科', value: 'mnwk' },
          { label: '神经外科', value: 'sjwk' },
          { label: '胸外科', value: 'xwk' },
          { label: '心脏外科', value: 'xzwk' },
          { label: '烧伤科', value: 'ssk' },
          { label: '整形外科', value: 'zxwk' },
          { label: '运动医学科', value: 'ydyxk' }
        ]
      },
      {
        label: '同德院区',
        value: 'tongde',
        children: [
          { label: '妇产科', value: 'fck' },
          { label: '儿科', value: 'ek' },
          { label: '急诊科', value: 'jzk' },
          { label: '重症医学科', value: 'icu' },
          { label: '眼科', value: 'yk' },
          { label: '耳鼻喉科', value: 'ebhk' },
          { label: '口腔科', value: 'kqk' },
          { label: '皮肤科', value: 'pfk' },
          { label: '肿瘤科', value: 'zlk' },
          { label: '康复医学科', value: 'kfkyk' }
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

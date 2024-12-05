export const createVersionConfigs = (measurements, t) => {
  if (measurements.mode === 'angle') {
    const angle = Math.round(measurements.angle);
    return [{
      ratios: {
        ratio23to12: false,
        ratio23to31: false
      },
      suffix: 'angle',
      legend: `${t('technical.showingAngle')} ${angle}${t('measurements.degrees')}`
    }];
  }

  const ratio2312 = Math.round(measurements.ratio2312);
  const ratio2313 = Math.round(measurements.ratio2313);

  return [
    {
      ratios: {
        ratio23to12: measurements.showRatio2312,
        ratio23to31: measurements.showRatio2313
      },
      suffix: 'both_ratios',
      legend: `${t('technical.showingRatio')} ${ratio2312}% ${t('technical.of')} ${t('technical.redLine')} ${t('technical.to')} ${t('technical.blueLine')} ${t('technical.and')} ${ratio2313}% ${t('technical.to')} ${t('technical.totalLength')}`
    },
    {
      ratios: {
        ratio23to12: true,
        ratio23to31: false
      },
      suffix: 'ratio2312',
      legend: `${t('technical.showingRatio')} ${ratio2312}% ${t('technical.of')} ${t('technical.redLine')} ${t('technical.to')} ${t('technical.blueLine')}`
    },
    {
      ratios: {
        ratio23to12: false,
        ratio23to31: true
      },
      suffix: 'ratio2313',
      legend: `${t('technical.showingRatio')} ${ratio2313}% ${t('technical.of')} ${t('technical.redLine')} ${t('technical.to')} ${t('technical.totalLength')}`
    }
  ];
};
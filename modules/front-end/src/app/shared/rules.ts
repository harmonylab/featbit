export interface IRule {
  id: string,
  name: string,
  conditions: ICondition[]

  // for feature flag
  variations?: IRuleVariation[]
}

export interface ICondition {
  property: string,
  op: string,
  value: string,

  multipleValue?: string[];
  type?: string;
}

export interface IVariation {
  id: string,
  value: string
}

export interface IRuleVariation {
  id: string;

  rollout: number[]; // only two elements, sta
  exptRollout?: number; // 0.45 means 45% TODO this is not optional

  // UI only
  percentage?: number; // the percentage representation of rolloutPercentage
  exptPercentage?: number;  // the percentage representation of exptRollout
  isInvalid?: boolean
}

export function handleRulesBeforeSave(rules: IRule[]) {
  let filteredRules = rules.filter(rule => rule.conditions.length > 0);

  // handle rule value
  filteredRules.forEach((rule: IRule) => {
    rule.conditions.forEach((condition: ICondition) => {
      if(condition.type === 'multi') {
        condition.value = JSON.stringify(condition.multipleValue);
      }
      if(condition.type === 'number') {
        condition.value = condition.value.toString();
      }
    })
  });

  return filteredRules;
}

export function isNotPercentageRollout(variations: IRuleVariation[]) : boolean {
  return variations.length === 0 || (variations.length === 1 && variations[0].rollout.length === 2 && variations[0].rollout[0] === 0 && variations[0].rollout[1] === 1);
}

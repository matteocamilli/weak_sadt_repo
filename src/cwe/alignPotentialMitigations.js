const alignPotentialMitigations = (mitigations) => mitigations.map(mitigation => `${mitigation.phase}\n${mitigation.description}`).join("\n\n")

module.exports = alignPotentialMitigations
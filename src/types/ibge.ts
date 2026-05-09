export interface IbgeAdministrativeRegion {
  id: string
  nome: string
}

export interface IbgeUfMetadata {
  id: string
  sigla: string
  nome: string
}

export interface IbgeMunicipalityMetadata {
  id: string
  nome: string
  uf: string
}

export interface DfMetadataResponse {
  uf: IbgeUfMetadata
  municipios: IbgeMunicipalityMetadata[]
  granularidadeOficial: string
  avisoGranularidade: string
  obtidoEm: string
}

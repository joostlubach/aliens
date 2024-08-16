import { uniq } from 'lodash'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { persist } from 'mobx-store'

import { axios } from '~/axios'

export class PromptStore {

  constructor() {
    makeObservable(this)
  }

  @observable
  public prompts: Array<[string, string, Prompt]> = []

  @computed
  public get keys() {
    return uniq(this.prompts.map(it => it[0]))
  }

  public getPrompt(key: string, language: string) {
    const entry = this.prompts.find(it => it[0] === key && it[1] === language)
    return entry?.[2] ?? null
  }

  @computed
  public get loaded() {
    return this.prompts.length > 0
  }

  @observable.ref
  private loadPromise: Promise<void> | null = null

  @computed
  public get loading() {
    return this.loadPromise != null
  }

  @action
  public loadPrompts() {
    return this.loadPromise ??= this.loadPromptsImpl()
  }

  private async loadPromptsImpl() {
    try {
      const response = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1ykvHvjuatHmvxX1bpj2F7LfKFb5yQXTGFPtr1_DIYdo/values/A:C',
        {
          params:  {key: 'AIzaSyCzAHmuBOD_2HV2lBS-cU5DJIPzKJxTsrg'},
          timeout: 2000,
        }
      )
      if (response.status !== 200) {
        console.warn(`HTTP ${response.status} while downloading texts`)
        console.log(response)
        return
      }

      this.readPrompts(response.data?.values ?? [])
    } catch (error) {
      console.warn(`Error while downloading texts: `, error)
    } finally {
      runInAction(() => {
        this.loadPromise = null
      })
    }
  }

  @action
  private readPrompts(values: any[][]) {
    values.shift()

    this.prompts.splice(0)
    for (const row of values) {
      const key = row[0].toString()
      const language = row[1].toString()
      const text = row[2].toString()

      const paragraphs = text.split('\n\n\n')
      const prompt: Prompt = {key, paragraphs}

      this.prompts.push([key, language, prompt])
    }
  }

}

persist(
  PromptStore,
  'prompts',
  store => ({prompts: store.prompts.map(([key, language, prompt]) => [key, language, prompt.paragraphs] as const)}),
  (store, state) => {
    store.prompts = state.prompts.map(([key, language, paragraphs]) => [key, language, {key, paragraphs}] as const)
  }
)

export type PromptKey = string | '$scanner' | '$typer'

export interface Prompt {
  key:        PromptKey
  paragraphs: string[]
}

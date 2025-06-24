import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { Professional } from './professional'

export interface ServiceProps {
  professionalId: UniqueEntityID
  professional?: Professional
  title: string
  slug: Slug
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Service extends Entity<ServiceProps> {
  get professionalId() {
    return this.props.professionalId
  }

  get professional() {
    return this.props.professional
  }

  set professional(professional: Professional | undefined) {
    this.props.professional = professional

    this.touch()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ServiceProps, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const service = new Service(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return service
  }
}

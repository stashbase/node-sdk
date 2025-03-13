type EventType = 'secrets.updated'

/**
 * @interface WebhookPayload
 * @description This is a sample interface with annotated properties.
 */
export type Event = {
  /**
   * @summary Unique identifier of the event
   */
  id: string

  /**
   * @summary Event type
   */
  type: EventType

  /**
   * @summary Unix timestamp of the event
   * @description Timestamp of when the event was processed (not the individual attempt)
   */
  created: number

  /**
   * @summary Test mode
   * @description Whether the event was triggered in test mode
   */
  testMode: boolean

  /**
   * @summary Event Data
   */
  data: {
    /**
     * @summary Workspace Data
     */
    workspace: {
      /**
       * @summary Unique Workspace ID
       */
      id: string

      /**
       * @summary Workspace Name
       */
      name: string

      /**
       * @summary Unique Workspace Slug
       */
      slug: string
    }

    /**
     * @summary Project Data
     */
    project: {
      /**
       * @summary Unique Project ID
       */
      id: string

      /**
       * @summary Project Name
       */
      name: string
    }

    /**
     * @summary Environment Data
     */
    environment: {
      /**
       * @summary Unique Environment ID
       */
      id: string

      /**
       * @summary Environment Name
       */
      name: string

      /**
       * @summary Whether the environment is production
       */
      isProduction: boolean
    }
  }
}

export type WebhookVerificationError = 'invalid_payload' | 'timestamp_too_old' | 'invalid_signature'
export type WebhookVerificationResult =
  | {
      error: WebhookVerificationError
      success: false
      event: null
    }
  | {
      error: null
      success: true
      event: Event
    }

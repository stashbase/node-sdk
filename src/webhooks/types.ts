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
   * @description Whether the event triggered in test mode
   */
  testMode: boolean

  /**
   * @summary Event data
   */
  data: {
    /**
     * @summary Id of the workspace
     */
    workspaceId: string

    /**
     * @summary Name of the project
     */
    project: string

    /**
     * @summary Name of the environment
     */
    environment: string
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

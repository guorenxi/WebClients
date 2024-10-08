import { Icon, UserDropdown } from '@proton/components'
import { APPS } from '@proton/shared/lib/constants'
import DocumentTitleDropdown from '../layout/DocumentTitleDropdown'
import { DocumentActiveUsers } from '../DocumentActiveUsers'
import { ConnectionStatus } from '../layout/ConnectionStatus'
import { useEffect, useState } from 'react'
import { useApplication } from '../../Containers/ApplicationProvider'
import { Button } from '@proton/atoms'
import { traceError } from '@proton/shared/lib/helpers/sentry'
import { CommentsButton } from './CommentsButton'
import { c } from 'ttag'
import type { DocumentAction } from '@proton/drive-store'
import type { AnyDocControllerInterface } from '@proton/docs-core/lib/Controller/Document/AnyDocControllerInterface'
import { isPrivateDocController } from '@proton/docs-core/lib/Controller/Document/isPrivateDocController'

const DocsHeader = ({ action }: { action?: DocumentAction['mode'] }) => {
  const application = useApplication()
  const [isReady, setIsReady] = useState(false)

  const [controller, setController] = useState<AnyDocControllerInterface | null>(null)
  useEffect(() => {
    return application.docLoader.addStatusObserver({
      onSuccess: () => {
        setIsReady(true)
        setController(application.docLoader.getDocController())
      },
      onError: traceError,
    })
  }, [application.docLoader])

  if (application.isRunningInNativeMobileWeb) {
    return null
  }

  return (
    <div className="flex items-center px-4 py-2" data-testid="docs-header">
      <DocumentTitleDropdown action={action} controller={controller} />

      <div className="w-2" />

      {isReady && <ConnectionStatus />}

      <div className="mr-auto" />

      <DocumentActiveUsers className="mr-2 hidden md:flex" />

      {controller && isPrivateDocController(controller) && controller.role.isAdmin() && (
        <Button
          shape="ghost"
          className="flex items-center gap-2 text-sm"
          data-testid="share-button"
          onClick={() => controller.openDocumentSharingModal()}
        >
          <Icon name="user-plus" />
          {c('Action').t`Share`}
        </Button>
      )}

      {controller && isPrivateDocController(controller) && controller?.role.canComment() && (
        <>
          <CommentsButton controller={controller} />
        </>
      )}

      <div className="w-4" />

      <UserDropdown app={APPS.PROTONDOCS} />
    </div>
  )
}

export default DocsHeader

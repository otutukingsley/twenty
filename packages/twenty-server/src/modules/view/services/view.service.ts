import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'class-validator';
import isEmpty from 'lodash.isempty';

import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { ViewFieldWorkspaceEntity } from 'src/modules/view/standard-objects/view-field.workspace-entity';

@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async addFieldToViews({
    workspaceId,
    fieldId,
    viewsIds,
    positions,
  }: {
    workspaceId: string;
    fieldId: string;
    viewsIds: string[];
    positions?: {
      [key: string]: number;
    }[];
  }) {
    const viewFieldRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace(
        workspaceId,
        ViewFieldWorkspaceEntity,
      );

    for (const viewId of viewsIds) {
      const position = positions?.[viewId];
      const newFieldInThisView = await viewFieldRepository.findBy({
        fieldMetadataId: fieldId,
        viewId: viewId as string,
        isVisible: true,
      });

      if (!isEmpty(newFieldInThisView)) {
        continue;
      }

      this.logger.log(
        `Adding new field ${fieldId} to view ${viewId} for workspace ${workspaceId}...`,
      );
      const newViewField = viewFieldRepository.create({
        viewId: viewId,
        fieldMetadataId: fieldId,
        isVisible: true,
        ...(isDefined(position) && { position: position }),
      });

      await viewFieldRepository.save(newViewField);
      this.logger.log(
        `New field successfully added to view ${viewId} for workspace ${workspaceId}`,
      );
    }
  }

  async removeFieldFromViews({
    workspaceId,
    fieldId,
  }: {
    workspaceId: string;
    fieldId: string;
  }) {
    const viewFieldRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace(
        workspaceId,
        ViewFieldWorkspaceEntity,
      );
    const viewsWithField = await viewFieldRepository.find({
      where: {
        fieldMetadataId: fieldId,
        isVisible: true,
      },
    });

    for (const viewWithField of viewsWithField) {
      const viewId = viewWithField.viewId;

      this.logger.log(
        `Removing field ${fieldId} from view ${viewId} for workspace ${workspaceId}...`,
      );
      await viewFieldRepository.delete({
        viewId: viewWithField.viewId as string,
        fieldMetadataId: fieldId,
      });

      this.logger.log(
        `Field ${fieldId} successfully removed from view ${viewId} for workspace ${workspaceId}`,
      );
    }
  }
}

/* eslint-disable react/no-array-index-key */
'use client';

import { contentSections } from './welcome.utils';
import { ContentSections } from './ContentSections';

export default function ContentSectionParent() {
  return (
    <>
      { contentSections.map((section, index) => (
        <ContentSections
          key={ index }
          title={ section.title }
          icon={ section.icon }
          text={ section.text }
          index={ index }
          imageComponent={ section.imageComponent }
        />
      )) }
    </>
  );
}

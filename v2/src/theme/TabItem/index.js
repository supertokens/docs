/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

function TabItem(props) {
  let { children, hidden, className } = props;
  return (
    <div
      role="tabpanel"
      {...{
        hidden,
        className,
      }}>
      {children}
    </div>
  );
}

export default TabItem;

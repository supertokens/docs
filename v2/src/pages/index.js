import React from 'react';
import Layout from '@theme/Layout';

function Hello() {
    return (
        <Layout title="Hello">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                }}>
                <p>
                    <a href="/docs/contribute/introduction">Click here</a> to see the user docs
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '20px',
                }}>
                <p>
                    <a href="/docs/contribute/introduction">Click here</a> to see the contributing docs
                </p>
            </div>
        </Layout>
    );
}

export default Hello;